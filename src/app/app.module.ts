
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

import { AppNavComponent } from './app-nav/app-nav.component';

import { OlprrSearchRoutingModule } from './olprr-search/olprr-search.routing';
import { LustSearchRoutingModule } from './lust-search/lust-search-routing.module';
import { UstSearchRoutingModule } from './ust-search/ust-search-routing.module';
import { OlprrSearchModule } from './olprr-search/olprr-search.module';
import { LustSearchModule } from './lust-search/lust-search.module';
import { UstSearchModule } from './ust-search/ust-search.module';
import { OlprrIncidentComponent } from './olprr-incident/olprr-incident.component';
import { ShowAllMessagesModule } from './show-all-messages/show-all-messages.module';
import { ShowErrorsModule } from './show-errors/show-errors.module';
import { CanDeactivateGuard } from './guards/can-deactivate-guard.service';
import { GuardDialogComponent } from './common/dialogs/guard-dialog.component';
import { SubmitStatusDialogComponent } from './common/dialogs/submit-status-dialog.component';
import { httpInterceptorProviders } from './http-interceptors';
import { ErrorsComponent } from './common/errors/errors.component';
import { ErrorsModule } from './common/errors/errors.module';
import { ErrorsRoutingModule } from './common/errors/errors-routing.module';
import { LustIncidentModule } from './lust-incident/lust-incident.module';
import { LustIncidentRoutingModule } from './lust-incident/lust-incident-routing.module';
import { ContactSearchModule } from './contact-search/contact-search.module';
import { ContactSearchRoutingModule } from './contact-search/contact-search-routing.module';


@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    OlprrSearchModule,
    LustSearchModule,
    UstSearchModule,
    ContactSearchModule,
    OlprrSearchRoutingModule,
    LustSearchRoutingModule,
    UstSearchRoutingModule,
    ContactSearchRoutingModule,
    ShowAllMessagesModule,
    ShowErrorsModule,
    ErrorsModule,
    ErrorsRoutingModule,
  ],
  declarations: [
    AppComponent,
    AppNavComponent,
    OlprrIncidentComponent,
    GuardDialogComponent,
    SubmitStatusDialogComponent,
    // ErrorsComponent,
  ],
  providers: [
    LogService,
    {provide: ErrorHandler, useClass: AppErrorHandler},
    {provide: RequestCache, useClass: RequestCacheWithMap },
    CanDeactivateGuard,
    httpInterceptorProviders,
  ],
  // exports: [AcceptDialogComponent],
  entryComponents: [GuardDialogComponent, SubmitStatusDialogComponent, ],
  bootstrap: [AppComponent],
})
export class AppModule { }
