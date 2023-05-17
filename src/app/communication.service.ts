import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../environments/environment.prod";
export const API_ENDPOINT = environment.APP_API_ENDPOINT;

export interface ComtradeInfo{
  name: string;
  values: Array<number>
  type: string;
  clicked: boolean;
  rms: Array<number>
}
export interface FaultCurrentInfo{
  name: string;
  value: number;
  time: number;
  indexOfValues: number
}

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor(private http: HttpClient) { }

  getScopes(): Observable<ComtradeInfo[]> {
    return this.http.get<ComtradeInfo[]>(`${API_ENDPOINT}scopes`);
  }
  getFaultCurrentInfo(): Observable<FaultCurrentInfo[]> {
    return this.http.get<FaultCurrentInfo[]>(`${API_ENDPOINT}info`);
  }
}
