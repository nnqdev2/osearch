import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { OlprrSearchResult } from '../models/olprr-search-result';
import { OlprrSearchFilter } from '../models/olprr-search-filter';
import { SiteType } from '../models/site-type';
import { DeqOffice } from '../models/deq-office';
import { IncidentStatus } from '../models/incident-status';
import { OlprrSearchResultWithStats } from '../models/olprr-search-results-with-stats';
import { ApOlprrGetIncident } from '../models/apOlprrGetIncident';
import { OlprrSearchResultStats } from '../models/olprr-search-result-stat';

@Injectable({
  providedIn: 'root'
})
export class LustDataService {

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
}

