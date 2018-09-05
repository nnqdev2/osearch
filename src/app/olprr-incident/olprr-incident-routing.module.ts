import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteTypesResolver } from '../resolvers/site-types-resolver.service';
import { ConfirmationTypesResolver } from '../resolvers/confirmation-types-resolver.service';
import { CountiesResolver } from '../resolvers/counties-resolver.service';
import { DiscoveryTypesResolver } from '../resolvers/discovery-types-resolver.service';
import { QuadrantsResolver } from '../resolvers/quadrants-resolver.service';
import { ReleaseCauseTypesResolver } from '../resolvers/release-cause-types-resolver.service';
import { SourceTypesResolver } from '../resolvers/source-types-resolver.service';
import { StatesResolver } from '../resolvers/states-resolver.service';
import { StreetTypesResolver } from '../resolvers/street-types-resolver.service';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { OlprrIncidentComponent } from './olprr-incident.component';

const routes: Routes = [
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
      canDeactivate: [CanDeactivateGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OlprrIncidentRoutingModule { }
export const olprrIncidentRoutingComponents = [OlprrIncidentComponent];
