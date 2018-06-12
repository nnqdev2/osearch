import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogPublisher, LogConsole, LogLocalStorage, LogWebApi, LogPublisherConfig } from './log-publishers';

export class IConfig {
    contractorUid: string;
    contractorPwd: string;
    confirmationtypeUrl: string;
    countyUrl: string;
    discoverytypeUrl: string;
    quadrantUrl: string;
    releaseCauseTypeUrl: string;
    sitetypeUrl: string;
    stateUrl: string;
    streettypeUrl: string;
    incidentUrl: string;
    deqOffices: string;
    olprrReviewType: string;
}

const APP_CONFIG_URL = './assets/config.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigService implements OnInit {
  // private configUrl = './assets/config.json';
  private configs: IConfig[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<IConfig[]>(APP_CONFIG_URL)
    .subscribe((data => {this.configs = data; }));
    const deqOffices = (this.configs['deqOffices']);
    console.log('****** configs');
    console.log(this.configs);
  }


  // getConfig(): Observable<IConfig> {
  //   console.error('*************** ConfigService getConfigs =====' );
  //   return this.http.get<IConfig>('./assets/config.json');
  // }

  // getConfig(): Observable<IConfig> {
  //   console.error('*************** ConfigService getConfig' );
  //   return this.http.get<IConfig>('./assets/config.json');
  // }

}
