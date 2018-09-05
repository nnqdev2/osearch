import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './shared/material.module';
import { RequestCache, RequestCacheWithMap } from './services/request-cache.service';
import { AppErrorHandler } from './common/app-error-handler';
import { LogService } from './common/log.service';
import { OlprrSearchRoutingModule } from './olprr-search/olprr-search.routing';
import { LustSearchRoutingModule } from './lust-search/lust-search-routing.module';
import { UstSearchRoutingModule } from './ust-search/ust-search-routing.module';
import { OlprrSearchModule } from './olprr-search/olprr-search.module';
import { LustSearchModule } from './lust-search/lust-search.module';
import { UstSearchModule } from './ust-search/ust-search.module';
import { ShowAllMessagesModule } from './show-all-messages/show-all-messages.module';
import { ShowErrorsModule } from './show-errors/show-errors.module';
import { CanDeactivateGuard } from './guards/can-deactivate-guard.service';
import { GuardDialogComponent } from './common/dialogs/guard-dialog.component';
import { SubmitStatusDialogComponent } from './common/dialogs/submit-status-dialog.component';
import { httpInterceptorProviders } from './http-interceptors';
import { ErrorsModule } from './common/errors/errors.module';
import { ErrorsRoutingModule } from './common/errors/errors-routing.module';
import { ContactSearchModule } from './contact-search/contact-search.module';
import { ContactSearchRoutingModule } from './contact-search/contact-search-routing.module';
import { OlprrIncidentRoutingModule } from './olprr-incident/olprr-incident-routing.module';
import { OlprrIncidentModule } from './olprr-incident/olprr-incident.module';


@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    ShowAllMessagesModule,
    ShowErrorsModule,
    ErrorsModule,
    ErrorsRoutingModule,
    OlprrIncidentModule,
    ContactSearchModule,
    LustSearchModule,
    UstSearchModule,
    OlprrSearchModule,
    OlprrIncidentRoutingModule,
    ContactSearchRoutingModule,
    UstSearchRoutingModule,
    LustSearchRoutingModule,
    OlprrSearchRoutingModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    GuardDialogComponent,
    SubmitStatusDialogComponent,
  ],
  providers: [
    LogService,
    {provide: ErrorHandler, useClass: AppErrorHandler},
    {provide: RequestCache, useClass: RequestCacheWithMap },
    CanDeactivateGuard,
    httpInterceptorProviders,
  ],
  // exports: [],
  entryComponents: [GuardDialogComponent, SubmitStatusDialogComponent
 ],
  bootstrap: [AppComponent],
})
export class AppModule { }
