// import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../shared/material.module';
import { OlprrSearchRoutingModule } from './olprr-search.routing';
import { AcceptedDialogComponent } from './accepted-dialog.component';
import { OlprrReviewComponent } from './olprr-review.component';
import { OlprrSearchFilterComponent } from './olprr-search-filter.component';
import { OlprrSearchResultComponent } from './olprr-search-result.component';
import { ShowErrorsModule } from '../show-errors/show-errors.module';
import { ShowAllMessagesModule } from '../show-all-messages/show-all-messages.module';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { UstSearchModule } from '../ust-search/ust-search.module';
import { LustSearchModule } from '../lust-search/lust-search.module';
import { SearchDialogComponent } from './search-dialog.component';

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
    LustSearchModule
  ],
  declarations: [
    OlprrSearchFilterComponent,
    OlprrSearchResultComponent,
    OlprrReviewComponent,
    AcceptedDialogComponent,
    SearchDialogComponent
  ],
  exports: [AcceptedDialogComponent, SearchDialogComponent],
  entryComponents: [AcceptedDialogComponent, SearchDialogComponent],
  providers: [
    CanDeactivateGuard,
  ]
})
export class OlprrSearchModule { }
