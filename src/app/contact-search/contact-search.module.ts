import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactSearchRoutingModule } from './/contact-search-routing.module';
import { ContactSearchFilterComponent } from './contact-search-filter.component';
import { ContactSearchResultComponent } from './contact-search-result.component';
import { MaterialModule } from '../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ContactSearchRoutingModule
  ],
  declarations: [ContactSearchFilterComponent, ContactSearchResultComponent]
})
export class ContactSearchModule { }
