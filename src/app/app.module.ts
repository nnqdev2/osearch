
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppComponent } from './app.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AppRoutingModule, routingComponents } from './app-routing.module';

import { MaterialModule } from './share/material.module';
import { SiteTypesResolver } from './share/site-types-resolver.service';
import { DeqOfficesResolver } from './share/deq-offices-resolver.service';
import { IncidentStatusesResolver } from './share/incident-statuses-resolver.service';
import { LustDataService } from './service/lust-data.service';
import { OlprrIncidentComponent } from './olprr-incident/olprr-incident.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
  ],
  declarations: [
    AppComponent,
    routingComponents,
    OlprrIncidentComponent
  ],

  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [LustDataService, SiteTypesResolver, DeqOfficesResolver, IncidentStatusesResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
