import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OlprrSearchFilterComponent } from './olprr-search/olprr-search-filter.component';
import { SiteTypesResolver } from './share/site-types-resolver.service';
import { DeqOfficesResolver } from './share/deq-offices-resolver.service';
import { IncidentStatusesResolver } from './share/incident-statuses-resolver.service';
import { OlprrSearchResultComponent } from './olprr-search/olprr-search-result.component';

const routes: Routes = [
  { path: '', redirectTo: 'osearch', pathMatch: 'full' },
  { path: '**', redirectTo: 'osearch', pathMatch: 'full' },
  // { path: '**', redirectTo: 'olprrsearch', pathMatch: 'full' },
  { path: 'osearch', component: OlprrSearchFilterComponent,
  resolve: {
    deqOffices: DeqOfficesResolver,
    incidentStatuses: IncidentStatusesResolver,
    siteTypes: SiteTypesResolver,
  }
 },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [OlprrSearchFilterComponent, OlprrSearchResultComponent];
