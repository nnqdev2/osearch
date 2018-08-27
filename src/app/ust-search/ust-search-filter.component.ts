import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable} from 'rxjs';

import { LustDataService } from '../services/lust-data.service';
import { UstSearchFilter } from '../models/ust-search-filter';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZipCode } from '../models/zipcode';
import { City } from '../models/city';
import { County } from '../models/county';
import { UstSearchResultStat } from '../models/ust-search-result-stat';

@Component({
  selector: 'app-ust-search-filter',
  templateUrl: './ust-search-filter.component.html',
  styleUrls: ['./ust-search-filter.component.scss']
})
export class UstSearchFilterComponent implements OnInit {
  ustSearchFilterForm: FormGroup;
  ustSearchFilter: UstSearchFilter;
  showUstSearchResultsFlag = false;

  zipCodes: ZipCode[] = [];
  cities: City[] = [];
  counties: County[] = [];

  @Output() rowSelected = new EventEmitter<UstSearchResultStat>();
  constructor(private lustDataService: LustDataService, private formBuilder: FormBuilder
    , private route: ActivatedRoute, private router: Router
  ) {}

  ngOnInit() {
    if (this.route.snapshot.url.length > 0) {
      this.route.data.subscribe((data: {zipCodes: ZipCode[]}) => {this.zipCodes = data.zipCodes; });
      this.route.data.subscribe((data: {cities: City[]}) => {this.cities = data.cities; });
      this.route.data.subscribe((data: {counties: County[]}) => {this.counties = data.counties; });
    } else {
      this.lustDataService.getZipCodes().subscribe(data => { this.zipCodes = data; });
      this.lustDataService.getCities().subscribe(data => { this.cities = data; });
      this.lustDataService.getCounties().subscribe(data => { this.counties = data; });
    }
    this.createSearchFilterForm();
  }
  private createSearchFilterForm() {
    this.ustSearchFilterForm = this.formBuilder.group({
      facilityName:  [''],
      facilityAddress:  [''],
      facilityCity: [''],
      facilityZip: [''],
      facilityCounty: [''],
      sortColumn: [1],
      sortOrder: [1],
      pageNumber: [1],
      rowsPerPage: [40],
    });
  }

  resetUstSearchFilterForm() {
    this.ustSearchFilterForm.reset();
    this.ustSearchFilter = Object.assign({}, this.ustSearchFilterForm.value);
    this.showUstSearchResultsFlag = false;
  }

  submitUstSearchFilterForm() {
    this.showUstSearchResultsFlag = false;
    this.ustSearchFilter = Object.assign({}, this.ustSearchFilterForm.value);
    // console.log(JSON.stringify(this.ustSearchFilter));
    this.showUstSearchResultsFlag = true;
  }

  onRowClicked(ustSearchResultStat: UstSearchResultStat) {
    this.rowSelected.emit(ustSearchResultStat);
  }

  onSelected(ustSearchResultStat: UstSearchResultStat) {
    this.rowSelected.emit(ustSearchResultStat);
  }
}














