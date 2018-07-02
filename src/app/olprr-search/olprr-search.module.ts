// import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from '../shared/material.module';
import { OlprrSearchRoutingModule } from './olprr-search.routing';
import { IncidentIdToNameService } from './incident-id-to-name.service';
import { AcceptDialogComponent } from './accept-dialog.component';
import { OlprrReviewComponent } from './olprr-review.component';
import { OlprrSearchFilterComponent } from './olprr-search-filter.component';
import { OlprrSearchResultComponent } from './olprr-search-result.component';
import { ShowErrorsComponent } from '../show-errors/show-errors.component';
import { ShowAllMessagesComponent } from '../show-all-messages/show-all-messages.component';
import { ShowErrorsModule } from '../show-errors/show-errors.module';
import { ShowAllMessagesModule } from '../show-all-messages/show-all-messages.module';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { UstSearchModule } from '../ust-search/ust-search.module';
import { UstSearchFilterComponent } from '../ust-search/ust-search-filter.component';
import { UstSearchResultComponent } from '../ust-search/ust-search-result.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    OlprrSearchRoutingModule,
    ShowErrorsModule,
    ShowAllMessagesModule,
    UstSearchModule,
  ],
  declarations: [
    OlprrSearchFilterComponent,
    OlprrSearchResultComponent,
    OlprrReviewComponent,
    AcceptDialogComponent
  ],
  exports: [AcceptDialogComponent],
  entryComponents: [AcceptDialogComponent, UstSearchFilterComponent, UstSearchResultComponent],
  providers: [
    CanDeactivateGuard,
  ]
})
export class OlprrSearchModule { }
