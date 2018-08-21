import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ContactSearchFilter } from '../../models/contact-search-filter';
import { ActivatedRoute, Router } from '@angular/router';
import { LustDataService } from '../../services/lust-data.service';

@Component({
  selector: 'app-contact-search-filter',
  templateUrl: './contact-search-filter.component.html',
  styleUrls: ['./contact-search-filter.component.scss']
})
export class ContactSearchFilterComponent implements OnInit {
  contactSearchFilterForm: FormGroup;
  contactSearchFilter: ContactSearchFilter;
  showSearchResultsFlag = false;


  constructor(private lustDataService: LustDataService, private formBuilder: FormBuilder
    , private route: ActivatedRoute, private router: Router
  ) {}

  ngOnInit() {
    this.createSearchFilterForm();
  }
  private createSearchFilterForm() {
    this.contactSearchFilterForm = this.formBuilder.group({
      firstName:  [''],
      lastName:  [''],
      organization: [''],
      sortColumn: [1],
      sortOrder: [1],
      pageNumber: [1],
      rowsPerPage: [40],
    });
  }

  resetUstSearchFilterForm() {
    this.contactSearchFilterForm.reset();
    this.contactSearchFilterForm = Object.assign({}, this.contactSearchFilterForm.value);
    this.showSearchResultsFlag = false;
  }

  submitUstSearchFilterForm() {
    this.showSearchResultsFlag = false;
    this.contactSearchFilterForm = Object.assign({}, this.contactSearchFilterForm.value);
    console.log(JSON.stringify(this.contactSearchFilterForm));
    this.showSearchResultsFlag = true;
  }
}

