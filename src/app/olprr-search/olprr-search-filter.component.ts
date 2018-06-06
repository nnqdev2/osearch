import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable} from 'rxjs';

import { SiteType } from '../models/site-type';
import { OlprrSearchFilter } from '../models/olprr-search-filter';
import { OlprrSearchResult } from '../models/olprr-search-result';
import { LustDataService } from '../service/lust-data.service';
import { DeqOffice } from '../models/deq-office';
import { IncidentStatus } from '../models/incident-status';
import { SiteTypesResolver } from '../share/site-types-resolver.service';
import { DeqOfficesResolver } from '../share/deq-offices-resolver.service';
import { IncidentStatusesResolver } from '../share/incident-statuses-resolver.service';
import { OlprrSearchResultWithStats } from '../models/olprr-search-results-with-stats';

@Component({
  selector: 'app-olprr-search-filter',
  templateUrl: './olprr-search-filter.component.html',
  styleUrls: ['./olprr-search-filter.component.scss'],
})
export class OlprrSearchFilterComponent implements OnInit {

  olprrSearchFilterForm: FormGroup;
  olprrSearchFilter: OlprrSearchFilter;
  olprrSearchResults: OlprrSearchResult[];
  olprrSearchResultsWithStats: OlprrSearchResultWithStats;
  showOlprrSearchResultsFlag = false;
  siteTypes: SiteType[] = [];
  deqOffices: DeqOffice[] = [];
  incidentStatuses: IncidentStatus[] = [];

  constructor(private lustDataService: LustDataService, private formBuilder: FormBuilder
    , private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.data.subscribe((data: {siteTypes: SiteType[]}) => {this.siteTypes = data.siteTypes; });
    this.route.data.subscribe((data: {deqOffices: DeqOffice[]}) => {this.deqOffices = data.deqOffices; });
    this.route.data.subscribe((data: {incidentStatuses: IncidentStatus[]}) => {this.incidentStatuses = data.incidentStatuses; });
    this.createOlprrSearchFilterForm();
  }

  private createOlprrSearchFilterForm() {
    this.olprrSearchFilterForm = this.formBuilder.group({
      deqOffice:  [''],
      incidentStatus:  [''],
      siteTypeCode: [''],
      olprrId: ['']
    });
  }

  resetOlprrSearchFilterForm() {
    this.olprrSearchFilterForm.reset();
    this.olprrSearchFilterForm.setValue({
      deqOffice: '',
      siteTypeCode: '',
      incidentStatus: '',
      olprrId: ''
    });
    this.olprrSearchFilter = Object.assign({}, this.olprrSearchFilterForm.value);
    this.showOlprrSearchResultsFlag = false;
  }

  submitOlprrSearchFilterForm() {
    this.showOlprrSearchResultsFlag = false;
    // const filters = Object.assign({}, this.olprrSearchFilter, this.olprrSearchFilterForm.value);
    this.olprrSearchFilter = Object.assign({}, this.olprrSearchFilterForm.value);
    console.log('searchfilter  olprrSearchFilter =====>');
    console.log(this.olprrSearchFilter);
    console.log(JSON.stringify(this.olprrSearchFilter));
    // this.olprrSearchFilter.deqOffice = this.olprrSearchFilterForm.controls.deqOffice.value;
    // this.olprrSearchFilter.incidentStatus = this.olprrSearchFilterForm.controls.incidentStatus.value;
    // this.olprrSearchFilter.siteType = this.olprrSearchFilterForm.controls.siteType.value;
    // this.olprrSearchFilter.olprrId = this.olprrSearchFilterForm.controls.olprrId.value;
    // this.olprrSearchFilter.deqOffice = 'NWR';
    // this.olprrSearchFilter.incidentStatus = 'NWR';
    // this.olprrSearchFilter.siteType = 'NWR';
    // this.olprrSearchFilter.olprrId = 12345;
    // console.log(filters.deqOffice.value);
    // console.log(this.olprrSearchFilter.deqOffice);
    // this.getOlprrSearchResults(p);
    this.showOlprrSearchResultsFlag = true;
  }

}


