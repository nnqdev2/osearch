import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LustSearch2RoutingModule } from './lust-search2-routing.module';
import { LustSearchFilterComponent } from './lust-search-filter/lust-search-filter.component';
import { LustSearchResultComponent } from './lust-search-result/lust-search-result.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../shared/material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShowErrorsModule } from '../show-errors/show-errors.module';
import { ShowAllMessagesModule } from '../show-all-messages/show-all-messages.module';

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
    LustSearch2RoutingModule
  ],
  declarations: [LustSearchFilterComponent, LustSearchResultComponent],
  exports: [LustSearchFilterComponent, LustSearchResultComponent],
  entryComponents: [LustSearchFilterComponent, LustSearchResultComponent]
})
export class LustSearch2Module { }
