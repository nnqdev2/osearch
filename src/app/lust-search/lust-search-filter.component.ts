import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable} from 'rxjs';

import { LustDataService } from '../services/lust-data.service';
import { LustSearchFilter } from '../models/lust-search-filter';
import { CleanupSiteType } from '../models/cleanup-site-type';
import { TankStatus } from '../models/tank-status';
import { FileStatus } from '../models/file-status';
import { ZipCode } from '../models/zipcode';
import { ProjectManager } from '../models/project-manager';
import { City } from '../models/city';
import { DateCompare } from '../models/date-compare';
import { Region } from '../models/region';
import { SiteType } from '../models/site-type';
import { County } from '../models/county';

@Component({
  selector: 'app-lust-search-filter',
  templateUrl: './lust-search-filter.component.html',
  styleUrls: ['./lust-search-filter.component.scss']
})
export class LustSearchFilterComponent implements OnInit {
  lustSearchFilterForm: FormGroup;
  lustSearchFilter: LustSearchFilter;
  showLustSearchResultsFlag = false;
  tankStatuses: TankStatus[] = [];
  fileStatuses: FileStatus[] = [];
  cleanupSiteTypes: CleanupSiteType[] = [];
  zipCodes: ZipCode[] = [];
  regions: Region[] = [];
  dateCompares: DateCompare[] = [];
  projectManagers: ProjectManager[] = [];
  cities: City[] = [];
  siteTypes: SiteType[] = [];
  counties: County[] = [];

  constructor(private lustDataService: LustDataService, private formBuilder: FormBuilder
    , private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.data.subscribe((data: {siteTypes: SiteType[]}) => {this.siteTypes = data.siteTypes; console.log(data.siteTypes); });
    this.route.data.subscribe((data: {cleanupSiteTypes: CleanupSiteType[]}) => {this.cleanupSiteTypes = data.cleanupSiteTypes; });
    this.route.data.subscribe((data: {fileStatuses: FileStatus[]}) => {this.fileStatuses = data.fileStatuses; });
    this.route.data.subscribe((data: {zipCodes: ZipCode[]}) => {this.zipCodes = data.zipCodes; });
    this.route.data.subscribe((data: {regions: Region[]}) => {this.regions = data.regions; });
    this.route.data.subscribe((data: {cities: City[]}) => {this.cities = data.cities; });
    this.route.data.subscribe((data: {dateCompares: DateCompare[]}) => {this.dateCompares = data.dateCompares; });
    this.route.data.subscribe((data: {tankStatuses: TankStatus[]}) => {this.tankStatuses = data.tankStatuses; });
    this.route.data.subscribe((data: {projectManagers: ProjectManager[]}) => {this.projectManagers = data.projectManagers; });
    this.route.data.subscribe((data: {counties: County[]}) => {this.counties = data.counties; });
    this.createSearchFilterForm();
  }
  private createSearchFilterForm() {
    this.lustSearchFilterForm = this.formBuilder.group({
      logCounty:  [''],
      logYear:  [''],
      logSeqNbr: [''],
      facilityId: [''],
      siteName:  [''],
      siteAddress:  [''],
      siteZipcode: [''],
      siteCounty: [''],
      siteCity: [''],
      regionCode: [''],
      releaseSiteTypeCode:  [''],
      cleanupSiteTypeId:  [''],
      fileStatusId: [''],
      projectManagerCode: [''],
      contactFirstName:  [''],
      contactLastName:  [''],
      contactOrganization: [''],
      tankStatusId: [''],
      hotAuditRejectInd:  [''],
      compareDate1Id:  [''],
      compareDate2Id: [''],
      compareDate1IdFromDate: [''],
      compareDate1IdToDate:  [''],
      compareDate2IdFromDate:  [''],
      compareDate2IdToDate: [''],
      sortColumn: [1],
      sortOrder: [1],
      pageNumber: [1],
      rowsPerPage: [30],
    });
  }

  resetLustSearchFilterForm() {
    this.lustSearchFilterForm.reset();
    this.lustSearchFilter = Object.assign({}, this.lustSearchFilterForm.value);
    this.showLustSearchResultsFlag = false;
  }

  submitLustSearchFilterForm() {
    this.showLustSearchResultsFlag = false;
    this.lustSearchFilter = Object.assign({}, this.lustSearchFilterForm.value);
    console.log('searchfilter  lustSearchFilter =====>');
    console.log(this.lustSearchFilter);
    console.log(JSON.stringify(this.lustSearchFilter));
    this.showLustSearchResultsFlag = true;
  }
}














