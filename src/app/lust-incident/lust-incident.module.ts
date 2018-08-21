import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LustIncidentRoutingModule } from './lust-incident-routing.module';
import { SiteAliasComponent } from './site-alias/site-alias.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../shared/material.module';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
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
  declarations: [SiteAliasComponent, ConfirmDeleteDialogComponent, SearchDialogComponent
    , ContactSearchFilterComponent, ContactSearchResultComponent],
  entryComponents: [ConfirmDeleteDialogComponent],
})
export class LustIncidentModule { }
