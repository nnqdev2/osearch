
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from '../shared/material.module';
import { OlprrSearchRoutingModule, olprrSearchRoutingComponents } from './olprr-search.routing';
import { IncidentIdToNameService } from './incident-id-to-name.service';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    OlprrSearchRoutingModule,
  ],
  declarations: [
    olprrSearchRoutingComponents,
  ],
  // providers: [
  //   IncidentIdToNameService,
  // ],
})
export class OlprrSearchModule { }
