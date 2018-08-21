import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LustIncidentRoutingModule } from './lust-incident-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../shared/material.module';
import { UstSearchModule } from '../ust-search/ust-search.module';
import { ContactSearchFilterComponent } from './contact-search/contact-search-filter.component';
import { ContactSearchResultComponent } from './contact-search/contact-search-result.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    LustIncidentRoutingModule,
    UstSearchModule,

  ],
  declarations: [ ContactSearchFilterComponent, ContactSearchResultComponent],
  entryComponents: [],
})
export class LustIncidentModule { }
