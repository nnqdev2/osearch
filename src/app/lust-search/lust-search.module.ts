import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from '../shared/material.module';

import { LustSearchRoutingModule, lustSearchRoutingComponents } from './lust-search-routing.module';
import { LustSearchFilterComponent } from './lust-search-filter.component';
import { LustSearchResultComponent } from './lust-search-result.component';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    LustSearchRoutingModule
  ],
  declarations: [lustSearchRoutingComponents, LustSearchResultComponent]
})
export class LustSearchModule { }


