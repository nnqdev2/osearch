
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AppRoutingModule, routingComponents } from './app-routing.module';

import { MaterialModule } from './shared/material.module';
import { LustDataService } from './services/lust-data.service';
import { RequestCache, RequestCacheWithMap } from './services/request-cache.service';
import { resolverProviders } from './resolvers/index';

import { AppErrorHandler } from './common/app-error-handler';
import { LogService } from './common/log.service';
import { LogPublishersService } from './common/log-publishers.service';
import { ConfigService } from './common/config.service';

import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { ShowAllMessagesComponent } from './show-all-messages/show-all-messages.component';
import { AppNavComponent } from './app-nav/app-nav.component';

import { IdToNameService } from './olprr-incident/id-to-name.service';
import { OlprrSearchRoutingModule } from './olprr-search/olprr-search.routing';
import { LustSearchRoutingModule } from './lust-search/lust-search-routing.module';
import { UstSearchRoutingModule } from './ust-search/ust-search-routing.module';


@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    OlprrSearchRoutingModule,
    LustSearchRoutingModule,
    UstSearchRoutingModule,
  ],
  declarations: [
    AppComponent,
    routingComponents,
    ShowErrorsComponent,
    ShowAllMessagesComponent,

  ],

  providers: [
    {provide: ErrorHandler, useClass: AppErrorHandler},
    {provide: RequestCache, useClass: RequestCacheWithMap },
    // resolverProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }