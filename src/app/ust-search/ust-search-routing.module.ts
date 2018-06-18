import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UstSearchResultComponent } from './ust-search-result.component';
import { UstSearchFilterComponent } from './ust-search-filter.component';

const routes: Routes = [
  { path: 'usearch', component: UstSearchFilterComponent,
  },
  // { path: 'lust/:olprrid', component: OlprrReviewComponent,
  //     resolve: {
  //       incidentData: IncidentDataResolver,
  //       incidentStatuses: IncidentStatusesResolver,
  //       siteTypes: SiteTypesResolver,
  //       confirmationTypes: ConfirmationTypesResolver,
  //       counties: CountiesResolver,
  //       discoveryTypes: DiscoveryTypesResolver,
  //       quadrants: QuadrantsResolver,
  //       releaseCauseTypes: ReleaseCauseTypesResolver,
  //       sourceTypes: SourceTypesResolver,
  //       states: StatesResolver,
  //       streetTypes: StreetTypesResolver,
  //     }
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UstSearchRoutingModule { }
export const ustSearchRoutingComponents = [UstSearchFilterComponent, UstSearchResultComponent];
