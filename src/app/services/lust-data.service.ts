import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { OlprrSearchResult } from '../models/olprr-search-result';
import { OlprrSearchFilter } from '../models/olprr-search-filter';
import { DeqOffice } from '../models/deq-office';
import { IncidentStatus } from '../models/incident-status';
import { OlprrSearchResultWithStats } from '../models/olprr-search-results-with-stats';
import { ApOlprrGetIncident } from '../models/apOlprrGetIncident';
import { OlprrSearchResultStat } from '../models/olprr-search-result-stat';


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
import { IncidentData } from '../models/incident-data';
import { FileStatus } from '../models/file-status';
import { TankStatus } from '../models/tank-status';
import { ProjectManager } from '../models/project-manager';
import { CleanupSiteType } from '../models/cleanup-site-type';
import { City } from '../models/city';
import { ZipCode } from '../models/zipcode';
import { Region } from '../models/region';
import { DateCompare } from '../models/date-compare';
import { LustSearchFilter } from '../models/lust-search-filter';
import { LustSearchResultStat } from '../models/lust-search-result-stat';
import { UstSearchFilter } from '../models/ust-search-filter';
import { UstSearchResultStat } from '../models/ust-search-result-stat';
import { PostalCountyVerification } from '../models/postal-county-verification';
import { AddressCorrectStat } from '../models/address-correct-stat';
import { LustIncident } from '../models/lust-incident';
import { LustIncidentInsertResult } from '../models/lust-incident-insert-result';
import { SiteAlias } from '../models/site-alias';
import { SiteAliasPost } from '../models/site-alias-post';

@Injectable({
  providedIn: 'root'
})
export class LustDataService {

  private loggers: LogPublisherConfig[] = [];
  private addressCorrectStats: AddressCorrectStat[] = [];

  constructor(private http: HttpClient)  { }

  getOlprrIncidents(olprrSearchFilter: OlprrSearchFilter): Observable<OlprrSearchResultStat[]> {
    // console.log('*******lust data service getOlprrIncidents(olprrSearchFilter: OlprrSearchFilter)');
    // console.log(olprrSearchFilter);
    const params = new HttpParams({
        fromString: `deqo=${olprrSearchFilter.deqOffice}&stat=${olprrSearchFilter.incidentStatus}`
        + `&st=${olprrSearchFilter.siteTypeCode}&id=${olprrSearchFilter.olprrId}`
        + `&sc=${olprrSearchFilter.sortColumn}&so=${olprrSearchFilter.sortOrder}`
        + `&pn=${olprrSearchFilter.pageNumber}&rpp=${olprrSearchFilter.rowsPerPage}`
    });
    return this.http.get<OlprrSearchResultStat[]>(environment.olprrapi_review_search, { params: params });
  }

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

  getIncidentData(olprrId: string): Observable<IncidentData | null> {
    return this.http.get<IncidentData>(environment.olprrapi_review_incidentdatabyid + olprrId);
  }

  getFileStatuses(): Observable<FileStatus[]> {
    return this.http.get<FileStatus[]>(environment.olprrapi_filestatus);
  }

  getTankStatuses(): Observable<TankStatus[]> {
    return this.http.get<TankStatus[]>(environment.olprrapi_tankstatus);
  }

  getProjectManagers(): Observable<ProjectManager[]> {
    return this.http.get<ProjectManager[]>(environment.olprrapi_projectmanager);
  }

  getCleanupSiteTypes(): Observable<CleanupSiteType[]> {
    return this.http.get<CleanupSiteType[]>(environment.olprrapi_cleanupsitetype);
  }

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(environment.olprrapi_city);
  }

  getZipCodes(): Observable<ZipCode[]> {
    return this.http.get<ZipCode[]>(environment.olprrapi_zipcode);
  }

  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(environment.olprrapi_region);
  }

  getDateCompares(): Observable<DateCompare[]> {
    return this.http.get<DateCompare[]>(environment.olprrapi_datecompare);
  }

  getLustSearch(lustSearchFilter: LustSearchFilter): Observable<LustSearchResultStat[]> {
    return this.http.post<LustSearchResultStat[]>(environment.olprrapi_lust_search, lustSearchFilter);
  }

  getUstSearch(ustSearchFilter: UstSearchFilter): Observable<UstSearchResultStat[]> {
    return this.http.post<UstSearchResultStat[]>(environment.olprrapi_ust_search, ustSearchFilter);
  }

  getPostalCountyVerification(reportedCountyCode: number, usPostalCountyCodeFips: string ): Observable<PostalCountyVerification> {
    // console.log('*******lust data service getOlprrIncidents(olprrSearchFilter: OlprrSearchFilter)');
    // console.log(olprrSearchFilter);
    const params = new HttpParams({
        fromString: `reported=${reportedCountyCode}&usPostal=${usPostalCountyCodeFips}`
    });
    return this.http.get<PostalCountyVerification>(environment.olprrapi_review_postalcounty, { params: params });
  }

  createLustIncident(incident: LustIncident): Observable<LustIncidentInsertResult> {
    return this.http.post<LustIncidentInsertResult>(environment.olprrapi_insert_lust, incident);
  }

  getSiteAlias(lustId: number): Observable<SiteAlias[]> {
    return this.http.get<SiteAlias[]>(environment.olprrapi_sitealias + '/' +  lustId);
  }

  insUpdSiteAlias(siteAliasPost: SiteAliasPost): Observable<SiteAliasPost> {
    return this.http.post<SiteAliasPost>(environment.olprrapi_sitealias , siteAliasPost);
  }

  delSiteAlias(siteNameAliasId: number): Observable<any|null> {
    return this.http.delete(environment.olprrapi_sitealias + '/' +  siteNameAliasId);
  }

}

