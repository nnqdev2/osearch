import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ContactSearchFilter } from '../models/contact-search-filter';
import { ActivatedRoute, Router } from '@angular/router';
import { LustDataService } from '../services/lust-data.service';
import { ContactSearchResultStat } from '../models/contact-search-result-stat';

@Component({
  selector: 'app-contact-search-filter',
  templateUrl: './contact-search-filter.component.html',
  styleUrls: ['./contact-search-filter.component.scss']
})
export class ContactSearchFilterComponent implements OnInit {
  contactSearchFilterForm: FormGroup;
  contactSearchFilter: ContactSearchFilter;
  showSearchResultsFlag = false;

  @Output() rowSelected = new EventEmitter<ContactSearchResultStat>();


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

  resetSearchFilterForm() {
    this.contactSearchFilterForm.reset();
    this.contactSearchFilter = Object.assign({}, this.contactSearchFilterForm.value);
    this.showSearchResultsFlag = false;
  }

  submitSearchFilterForm() {
    this.showSearchResultsFlag = false;
    this.contactSearchFilter = Object.assign({}, this.contactSearchFilterForm.value);
    this.showSearchResultsFlag = true;
  }

  onSelected(contactSearchResultStat: ContactSearchResultStat) {
    this.rowSelected.emit(contactSearchResultStat);
  }
}
