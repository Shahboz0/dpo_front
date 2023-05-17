import {Component, ElementRef, OnInit} from '@angular/core';
import { ECharts, EChartsOption, EChartsType} from "echarts/types/dist/echarts";
import {CommunicationService, ComtradeInfo, FaultCurrentInfo} from "./communication.service";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'front';
  scopeOptions!: EChartsOption;
  options!: EChartsOption;
  datasource!: ComtradeInfo[]
  tabIndex: number = 0;
  private scopeEcharts!: EChartsType;
  private rmsEcharts!: EChartsType;
  tableDatasource: FaultCurrentInfo[] = [];
  displayedColumns: string[] = ['position', 'time', 'value'];


  constructor(private service: CommunicationService,
              private el: ElementRef) {

  }

  ngOnInit(): void {
    this.service.getScopes().subscribe(comtradeInJson => {
      this.datasource = comtradeInJson
    })
  }
  setCharts(row: ComtradeInfo): void {
      row.clicked = !row.clicked
      this.scopeOptions = {
        xAxis: [
          {data: this.datasource[0].values.map((value: any, index: any) => index), gridIndex: 0},
          {data: this.datasource[0].values.map((value: any, index: any) => index), gridIndex: 1},
        ],
        yAxis: [
          {gridIndex: 0},
          {gridIndex: 1, splitNumber: 1},
        ],
        series:
          this.datasource.filter(value => value.clicked).map(value => {
            return value.type === 'analog' ? {
                name: value.name,
                type: 'line',
                showSymbol: false,
                data: value.values,
                xAxisIndex: 0,
                yAxisIndex: 0,
              } :
              {
                name: value.name,
                type: 'line',
                showSymbol: false,
                data: value.values,
                xAxisIndex: 1,
                yAxisIndex: 1,
                areaStyle: {opacity: 0.1}
              }
          }),
        dataZoom: [
          {type: 'inside', xAxisIndex: [0, 1]}
        ],
        grid: [
          {top: '5%', bottom: '25%', left: '7%', right: '1%'},
          {top: '85%', bottom: '5%', left: '7%', right: '1%'},
        ],
        tooltip: {
          trigger: 'axis',
          align: 'left',
          verticalAlign: 'middle',
        },
      }
    // @ts-ignore
      this.scopeOptions.dataZoom = this.echarts.getOption().dataZoom;
      this.scopeEcharts.setOption(this.scopeOptions)
  }
  setRMS(row: ComtradeInfo): void {
    if (row.type === 'analog'){
      row.clicked = !row.clicked
      this.options = {
        xAxis:
          {data: this.datasource[0].values.map((value: any, index: any) => index)},
        yAxis: {},
        series:
          this.datasource.filter(value => value.clicked).map(value => {
              return  {
                name: value.name,
                type: 'line',
                showSymbol: false,
                data: value.rms,
              }
          }),
        tooltip: {
          trigger: 'axis',
          align: 'left',
          verticalAlign: 'middle',
        },
      }
      this.rmsEcharts.setOption(this.options)
    }
  }

  onMatTabChange(event: MatTabChangeEvent): void {
      this.tabIndex = event.index;
      this.datasource.forEach(value => {
        value.clicked = false
      })
  }

  onChartScopeInit(event: ECharts): void {
    this.scopeEcharts = event
  }

  onChartRMSInit(event: ECharts): void  {
    this.rmsEcharts = event

  }

  getTableData(): void {
    const btn = this.el.nativeElement.querySelector('button')
    btn.disabled = true
    this.service.getFaultCurrentInfo().subscribe(value => {
      this.tableDatasource = value;
    })
  }
}
