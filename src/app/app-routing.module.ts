import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OlprrSearchFilterComponent } from './olprr-search/olprr-search-filter.component';
import { OlprrSearchResultComponent } from './olprr-search/olprr-search-result.component';
import { OlprrIncidentComponent } from './olprr-incident/olprr-incident.component';
import { OlprrReviewComponent } from './olprr-search/olprr-review.component';
import { AppNavComponent } from './app-nav/app-nav.component';

import { SiteTypesResolver } from './resolvers/site-types-resolver.service';
import { DeqOfficesResolver } from './resolvers/deq-offices-resolver.service';
import { IncidentStatusesResolver } from './resolvers/incident-statuses-resolver.service';
import { ConfirmationTypesResolver } from './resolvers/confirmation-types-resolver.service';
import { CountiesResolver } from './resolvers/counties-resolver.service';
import { DiscoveryTypesResolver } from './resolvers/discovery-types-resolver.service';
import { QuadrantsResolver } from './resolvers/quadrants-resolver.service';
import { ReleaseCauseTypesResolver } from './resolvers/release-cause-types-resolver.service';
import { SourceTypesResolver } from './resolvers/source-types-resolver.service';
import { StatesResolver } from './resolvers/states-resolver.service';
import { StreetTypesResolver } from './resolvers/street-types-resolver.service';
import { IncidentReviewResolver } from './resolvers/incident-resolver.service';



const routes: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  { path: 'app', component: AppNavComponent
  },
  { path: 'osearch', component: OlprrSearchFilterComponent,
   resolve: {
    deqOffices: DeqOfficesResolver,
    incidentStatuses: IncidentStatusesResolver,
    siteTypes: SiteTypesResolver,
  }, },
  { path: 'incident', component: OlprrIncidentComponent,
      resolve: {
        siteTypes: SiteTypesResolver,
        confirmationTypes: ConfirmationTypesResolver,
        counties: CountiesResolver,
        discoveryTypes: DiscoveryTypesResolver,
        quadrants: QuadrantsResolver,
        releaseCauseTypes: ReleaseCauseTypesResolver,
        sourceTypes: SourceTypesResolver,
        states: StatesResolver,
        streetTypes: StreetTypesResolver,
      },

  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [AppNavComponent, OlprrSearchFilterComponent
  , OlprrSearchResultComponent, OlprrReviewComponent, OlprrIncidentComponent];


