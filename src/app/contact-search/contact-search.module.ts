import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactSearchRoutingModule, contactSearchRoutingComponents } from './/contact-search-routing.module';
import { ContactSearchFilterComponent } from './contact-search-filter.component';
import { ContactSearchResultComponent } from './contact-search-result.component';
import { MaterialModule } from '../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowErrorsModule } from '../show-errors/show-errors.module';
import { ShowAllMessagesModule } from '../show-all-messages/show-all-messages.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    // BrowserAnimationsModule,
    MaterialModule,
    NgbModule.forRoot(),
    ShowErrorsModule,
    ShowAllMessagesModule,
    ContactSearchRoutingModule
  ],
  declarations: [ContactSearchFilterComponent, ContactSearchResultComponent],
  exports: [ContactSearchFilterComponent, ContactSearchResultComponent],
  entryComponents: [ContactSearchFilterComponent, ContactSearchResultComponent ],
})
export class ContactSearchModule { }
