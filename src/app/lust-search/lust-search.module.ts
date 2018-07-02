import { CommonModule } from '@angular/common';
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
import { LustSearchDialogComponent } from './lust-search-dialog.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    LustSearchRoutingModule
  ],
  declarations: [lustSearchRoutingComponents, LustSearchDialogComponent],
  exports: [lustSearchRoutingComponents]
})
export class LustSearchModule { }


