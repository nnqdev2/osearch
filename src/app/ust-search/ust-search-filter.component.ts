import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable} from 'rxjs';

import { LustDataService } from '../services/lust-data.service';
import { UstSearchFilter } from '../models/ust-search-filter';

@Component({
  selector: 'app-ust-search-filter',
  templateUrl: './ust-search-filter.component.html',
  styleUrls: ['./ust-search-filter.component.scss']
})
export class UstSearchFilterComponent implements OnInit {
  ustSearchFilterForm: FormGroup;
  ustSearchFilter: UstSearchFilter;
  showUstSearchResultsFlag = false;


  constructor(private lustDataService: LustDataService, private formBuilder: FormBuilder
    , private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.createSearchFilterForm();
  }
  private createSearchFilterForm() {
    this.ustSearchFilterForm = this.formBuilder.group({
      facilityName:  [''],
      facilityAddress:  [''],
      facilityCity: [''],
      facilityZip: [''],
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
    console.log('searchfilter  ustSearchFilter =====>');
    console.log(this.ustSearchFilter);
    console.log(JSON.stringify(this.ustSearchFilter));
    this.showUstSearchResultsFlag = true;
  }
}














