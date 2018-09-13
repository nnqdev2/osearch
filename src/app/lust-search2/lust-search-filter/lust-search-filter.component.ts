import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LustDataService } from '../../services/lust-data.service';
import { LustSearchFilter } from '../../models/lust-search-filter';
import { CleanupSiteType } from '../../models/cleanup-site-type';
import { TankStatus } from '../../models/tank-status';
import { FileStatus } from '../../models/file-status';
import { ZipCode } from '../../models/zipcode';
import { ProjectManager } from '../../models/project-manager';
import { City } from '../../models/city';
import { DateCompare } from '../../models/date-compare';
import { Region } from '../../models/region';
import { SiteType } from '../../models/site-type';
import { County } from '../../models/county';

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

  isSearchOnly = false;

  constructor(private formBuilder: FormBuilder
    , private route: ActivatedRoute , private router: Router
    , private lustDataService: LustDataService) {}

  ngOnInit() {
    if (this.route.snapshot.url.length > 0) {
      this.isSearchOnly = false;
      this.route.data.subscribe((data: {siteTypes: SiteType[]}) => { this.siteTypes = data.siteTypes; });
      this.route.data.subscribe((data: {cleanupSiteTypes: CleanupSiteType[]}) => {this.cleanupSiteTypes = data.cleanupSiteTypes; });
      this.route.data.subscribe((data: {fileStatuses: FileStatus[]}) => {this.fileStatuses = data.fileStatuses; });
      this.route.data.subscribe((data: {zipCodes: ZipCode[]}) => {this.zipCodes = data.zipCodes; });
      this.route.data.subscribe((data: {regions: Region[]}) => {this.regions = data.regions; });
      this.route.data.subscribe((data: {cities: City[]}) => {this.cities = data.cities; });
      this.route.data.subscribe((data: {dateCompares: DateCompare[]}) => {this.dateCompares = data.dateCompares; });
      this.route.data.subscribe((data: {tankStatuses: TankStatus[]}) => {this.tankStatuses = data.tankStatuses; });
      this.route.data.subscribe((data: {projectManagers: ProjectManager[]}) => {this.projectManagers = data.projectManagers; });
      this.route.data.subscribe((data: {counties: County[]}) => {this.counties = data.counties; });
    } else {
      this.isSearchOnly = true;
      this.lustDataService.getSiteTypes().subscribe(data => { this.siteTypes = data; });
      this.lustDataService.getCleanupSiteTypes().subscribe(data => { this.cleanupSiteTypes = data; });
      this.lustDataService.getFileStatuses().subscribe(data => { this.fileStatuses = data; });
      this.lustDataService.getZipCodes().subscribe(data => { this.zipCodes = data; });
      this.lustDataService.getRegions().subscribe(data => { this.regions = data; });
      this.lustDataService.getCities().subscribe(data => { this.cities = data; });
      this.lustDataService.getDateCompares().subscribe(data => { this.dateCompares = data; });
      this.lustDataService.getTankStatuses().subscribe(data => { this.tankStatuses = data; });
      this.lustDataService.getProjectManagers().subscribe(data => { this.projectManagers = data; });
      this.lustDataService.getCounties().subscribe(data => { this.counties = data; });
    }
    this.createSearchFilterForm();
  }
  private createSearchFilterForm() {
    this.lustSearchFilterForm = this.formBuilder.group({
      logCounty:  ['', Validators.compose([Validators.maxLength(2), Validators.pattern('[0-9][0-9]')])],
      logYear:  ['', Validators.compose([Validators.maxLength(2), Validators.pattern('[0-9][0-9]')])],
      logSeqNbr: ['', Validators.compose([Validators.maxLength(4), Validators.pattern('[0-9][0-9][0-9][0-9]')])],
      facilityId: [''],
      siteName:  [''],
      siteAddress:  [''],
      siteZipcode: [''],
      siteCounty: [''],
      siteCity: [''],
      regionCode: [''],
      releaseSiteTypeCode:  [''],
      cleanupSiteTypeId:  [''],
      fileStatusTypeId: [''],
      projectManagerCode: [''],
      contactFirstName:  [''],
      contactLastName:  [''],
      contactOrganization: [''],
      tankStatusId: [''],
      hotAuditRejectInd:  [0],
      compareDate1Id:  [''],
      compareDate2Id: [''],
      compareDate1IdFromDate: [''],
      compareDate1IdToDate:  [''],
      compareDate2IdFromDate:  [''],
      compareDate2IdToDate: [''],
      sortColumn: [1],
      sortOrder: [1],
      pageNumber: [1],
      rowsPerPage: [40],
    });
  }

  resetLustSearchFilterForm() {
    this.lustSearchFilterForm.reset();
    this.lustSearchFilter = Object.assign({}, this.lustSearchFilterForm.value);
    this.showLustSearchResultsFlag = false;
  }

  submitLustSearchFilterForm() {
    if (this.lustSearchFilterForm.controls.hotAuditRejectInd.value === false) {
      this.lustSearchFilterForm.controls.hotAuditRejectInd.setValue(0);
    }
    if (this.lustSearchFilterForm.controls.hotAuditRejectInd.value === true) {
      this.lustSearchFilterForm.controls.hotAuditRejectInd.setValue(1);
    }
    this.showLustSearchResultsFlag = false;
    this.lustSearchFilter = Object.assign({}, this.lustSearchFilterForm.value);
    // console.log(JSON.stringify(this.lustSearchFilter));
    this.showLustSearchResultsFlag = true;
  }


  createIncident() {
    console.log('createIncident');
    this.router.navigate(['lust']);
  }

}














