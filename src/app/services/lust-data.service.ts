import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { OlprrSearchResult } from '../models/olprr-search-result';
import { OlprrSearchFilter } from '../models/olprr-search-filter';
import { DeqOffice } from '../models/deq-office';
import { IncidentStatus } from '../models/incident-status';
import { OlprrSearchResultWithStats } from '../models/olprr-search-results-with-stats';
import { ApOlprrGetIncident } from '../models/apOlprrGetIncident';
import { OlprrSearchResultStats } from '../models/olprr-search-result-stat';


import { Incident } from '../models/incident';
import { ConfirmationType } from '../models/confirmation-type';
import { County } from '../models/county';
import { DiscoveryType } from '../models/discovery-type';
import { Quadrant } from '../models/quadrant';
import { ReleaseCauseType } from '../models/release-cause-type';
import { SiteType } from '../models/site-type';
import { SourceType } from '../models/source-type';
import { State } from '../models/state';
import { StreetType } from '../models/street-type';
import { LogPublisherConfig } from '../common/log-publishers';

@Injectable({
  providedIn: 'root'
})
export class LustDataService {

  private loggers: LogPublisherConfig[] = [];

  constructor(private http: HttpClient)  { }

  getOlprrIncidents(olprrSearchFilter: OlprrSearchFilter): Observable<OlprrSearchResultStats[]> {
    console.log('*******lust data service getOlprrIncidents(olprrSearchFilter: OlprrSearchFilter)');
    console.log(olprrSearchFilter);
    const params = new HttpParams({
        fromString: `deqo=${olprrSearchFilter.deqOffice}&stat=${olprrSearchFilter.incidentStatus}`
        + `&st=${olprrSearchFilter.siteTypeCode}&id=${olprrSearchFilter.olprrId}`
        + `&sc=${olprrSearchFilter.sortColumn}&so=${olprrSearchFilter.sortOrder}`
        + `&pn=${olprrSearchFilter.pageNumber}&rpp=${olprrSearchFilter.rowsPerPage}`
    });
    return this.http.get<OlprrSearchResultStats[]>(environment.olprrapi_review_search, { params: params });
  }

  // getOlprrIncidents(olprrSearchFilter: OlprrSearchFilter): Observable<OlprrSearchResultWithStats> {
  //   const params = new HttpParams({
  //       fromString: `deqo=${olprrSearchFilter.deqOffice}&stat=${olprrSearchFilter.incidentStatus}`
  //       + `&st=${olprrSearchFilter.siteTypeCode}&olprrid=${olprrSearchFilter.olprrId}&sc=1&so=1&pn=1&rpp=40`
  //   });
  //   return this.http.get<OlprrSearchResultWithStats>(environment.olprrapi_review_search, { params: params });
  // }

  getSiteTypes(): Observable<SiteType[]> {
    return this.http.get<SiteType[]>(environment.olprrapi_sitetype);
  }

  getDeqOffices(): Observable<DeqOffice[]> {
    return this.http.get<DeqOffice[]>(environment.olprrapi_deqoffice);
  }

  getIncidentStatuses(): Observable<IncidentStatus[]> {
    return this.http.get<IncidentStatus[]>(environment.olprrapi_incidentstatus);
  }

  getConfirmationTypes(): Observable<ConfirmationType[]> {
    return this.http.get<ConfirmationType[]>(environment.olprrapi_confirmationtype);
  }

  getCounties(): Observable<County[]> {
    return this.http.get<County[]>(environment.olprrapi_county);
  }
  getDiscoveryTypes(): Observable<DiscoveryType[]> {
    return this.http.get<DiscoveryType[]>(environment.olprrapi_discoverytype);
  }

  getQuadrants(): Observable<Quadrant[]> {
    return this.http.get<Quadrant[]>(environment.olprrapi_quadrant);
  }

  getReleaseCauseTypes(): Observable<ReleaseCauseType[]> {
    return this.http.get<ReleaseCauseType[]>(environment.olprrapi_releasecausetype);
  }

  getSourceTypes(): Observable<SourceType[]> {
    return this.http.get<SourceType[]>(environment.olprrapi_sourcetype);
  }

  getStates(): Observable<State[]> {
    return this.http.get<State[]>(environment.olprrapi_state);
  }

  getStreetTypes(): Observable<StreetType[]> {
    return this.http.get<StreetType[]>(environment.olprrapi_streettype);
  }

  createIncident(incident: Incident): Observable<Incident> {
    return this.http.post<Incident>(environment.olprrapi_incident, incident);
  }




}

