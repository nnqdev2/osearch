import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable} from 'rxjs';
import { OlprrSearchFilter } from '../models/olprr-search-filter';
import { DeqOffice } from '../models/deq-office';
import { IncidentStatus } from '../models/incident-status';
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
import { LustIncidentInsertResult } from '../models/lust-incident-insert-result';
import { SiteAlias } from '../models/site-alias';
import { SiteAliasPost } from '../models/site-alias-post';
import { ContactSearchFilter } from '../models/contact-search-filter';
import { ContactSearchResultStat } from '../models/contact-search-result-stat';
import { PostalCountyLookup } from '../models/postal-county-lookup';
import { LustIncidentGet } from '../models/lust-incident-get';
import { Brownfield } from '../models/brownfield';
import { SiteType2 } from '../models/site-type2';
import { LustIncidentUpdateUpdate } from '../models/lust-incident-update-update';
import { LustIncidentUpdate } from '../models/lust-incident';
import { LustIncidentUpdateResult } from '../models/lust-incident-update-Result';

@Injectable({
  providedIn: 'root'
})
export class LustDataService {


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

  getBrownfields(): Observable<Brownfield[]> {
    return this.http.get<Brownfield[]>(environment.olprrapi_brownfield);
  }

  getSiteType2s(): Observable<SiteType2[]> {
    return this.http.get<SiteType2[]>(environment.olprrapi_sitetype2);
  }

  getProjectManagersByLustId(lustId: number): Observable<ProjectManager[]> {
    return this.http.get<ProjectManager[]>(environment.olprrapi_lust_pm + '/' + lustId);
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

  createLustIncident(incident: LustIncidentUpdate): Observable<LustIncidentInsertResult> {
    return this.http.post<LustIncidentInsertResult>(environment.olprrapi_insert_lust, incident);
  }

  getSiteAliases(lustId: number): Observable<SiteAlias[]> {
    return this.http.get<SiteAlias[]>(environment.olprrapi_sitealias + '/' +  lustId);
  }

  insUpdSiteAlias(siteAliasPost: SiteAliasPost): Observable<SiteAliasPost> {
    return this.http.post<SiteAliasPost>(environment.olprrapi_sitealias , siteAliasPost);
  }

  delSiteAlias(siteNameAliasId: number): Observable<any|null> {
    return this.http.delete(environment.olprrapi_sitealias + '/' +  siteNameAliasId);
  }

  getContacts(contactSearchFilter: ContactSearchFilter): Observable<ContactSearchResultStat[]> {
    // console.log('*******lust data service getOlprrIncidents(olprrSearchFilter: OlprrSearchFilter)');
    // console.log(olprrSearchFilter);
    const params = new HttpParams({
        fromString: `fname=${contactSearchFilter.firstName}&lname=${contactSearchFilter.lastName}`
        + `&org=${contactSearchFilter.organization}`
        + `&sc=${contactSearchFilter.sortColumn}&so=${contactSearchFilter.sortOrder}`
        + `&pn=${contactSearchFilter.pageNumber}&rpp=${contactSearchFilter.rowsPerPage}`
    });
    return this.http.get<ContactSearchResultStat[]>(environment.olprrapi_contact, { params: params });
  }

  getPostalCountyLookup(usPostalCountyCodeFips: number ): Observable<PostalCountyLookup> {
    return this.http.get<PostalCountyLookup>(environment.olprrapi_postalcounty_lookup + '/' +  usPostalCountyCodeFips);
  }

  getLustIncident(lustId: string ): Observable<LustIncidentGet> {
    return this.http.get<LustIncidentGet>(environment.olprrapi_lust_incident_get + '/' +  +lustId);
  }

  updateLustIncident(lustIncidentUpdate: LustIncidentUpdate): Observable<LustIncidentUpdateResult> {
    return this.http.post<LustIncidentUpdateResult>(environment.olprrapi_lust_incident_update , lustIncidentUpdate);
  }

}

