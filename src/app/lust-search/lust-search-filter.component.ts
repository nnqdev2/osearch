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

@Component({
  selector: 'app-lust-search-filter',
  templateUrl: './lust-search-filter.component.html',
  styleUrls: ['./lust-search-filter.component.css']
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

  constructor(private lustDataService: LustDataService, private formBuilder: FormBuilder
    , private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // this.route.data.subscribe((data: {siteTypes: SiteType[]}) => {this.siteTypes = data.siteTypes; console.log(data.siteTypes); });
    // this.route.data.subscribe((data: {deqOffices: DeqOffice[]}) => {this.deqOffices = data.deqOffices; });
    // this.route.data.subscribe((data: {incidentStatuses: IncidentStatus[]}) => {this.incidentStatuses = data.incidentStatuses; });
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
      regionCode: [''],
      releaseSiteTypeCode:  [''],
      cleanUpSiteTypeId:  [''],
      fileStatusId: [''],
      projectManager: [''],
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














