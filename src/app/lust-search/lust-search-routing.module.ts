import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteTypesResolver } from '../resolvers/site-types-resolver.service';
import { TankStatusesResolver } from '../resolvers/tank-statuses-resolver.service';
import { FileStatusesResolver } from '../resolvers/file-statuses-resolver.service';
import { ZipCodesResolver } from '../resolvers/zipcodes-resolver.service';
import { RegionsResolver } from '../resolvers/regions-resolver.service';
import { CitiesResolver } from '../resolvers/cities-resolver.service';
import { DateComparesResolver } from '../resolvers/date-compares-resolver.service';
import { ProjectManagersResolver } from '../resolvers/project-managers-resolver.service';
import { CleanupSiteTypesResolver } from '../resolvers/cleanup-site-types-resolver.service';
import { CountiesResolver } from '../resolvers/counties-resolver.service';
import { LustSearchResultComponent } from './lust-search-result.component';
import { LustSearchFilterComponent } from './lust-search-filter.component';
import { ConfirmationTypesResolver } from '../resolvers/confirmation-types-resolver.service';
import { DiscoveryTypesResolver } from '../resolvers/discovery-types-resolver.service';
import { ReleaseCauseTypesResolver } from '../resolvers/release-cause-types-resolver.service';
import { SourceTypesResolver } from '../resolvers/source-types-resolver.service';
import { StatesResolver } from '../resolvers/states-resolver.service';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { LustIncidentCreateComponent } from './lust-incident-create/lust-incident-create.component';
import { LustIncidentEditComponent } from './lust-incident-edit/lust-incident-edit.component';

const routes: Routes = [
  { path: 'lsearch', component: LustSearchFilterComponent,
    resolve: {
      tankStatuses: TankStatusesResolver,
      fileStatuses: FileStatusesResolver,
      siteTypes: SiteTypesResolver,
      zipCodes: ZipCodesResolver,
      regions: RegionsResolver,
      cities: CitiesResolver,
      projectManagers: ProjectManagersResolver,
      dateCompares: DateComparesResolver,
      cleanupSiteTypes: CleanupSiteTypesResolver,
      counties: CountiesResolver,
    },
  },
  { path: 'lust/new', component: LustIncidentCreateComponent,
    resolve: {
      siteTypes: SiteTypesResolver,
      confirmationTypes: ConfirmationTypesResolver,
      counties: CountiesResolver,
      discoveryTypes: DiscoveryTypesResolver,
      releaseCauseTypes: ReleaseCauseTypesResolver,
      sourceTypes: SourceTypesResolver,
      states: StatesResolver,
      zipCodes: ZipCodesResolver,
    },
    canDeactivate: [CanDeactivateGuard]
  },
  { path: 'lust/:lustid', component: LustIncidentEditComponent,
    resolve: {
      siteTypes: SiteTypesResolver,
      confirmationTypes: ConfirmationTypesResolver,
      counties: CountiesResolver,
      discoveryTypes: DiscoveryTypesResolver,
      releaseCauseTypes: ReleaseCauseTypesResolver,
      sourceTypes: SourceTypesResolver,
      states: StatesResolver,
      zipCodes: ZipCodesResolver,
    },
    canDeactivate: [CanDeactivateGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LustSearchRoutingModule { }
export const lustSearchRoutingComponents = [LustSearchFilterComponent, LustSearchResultComponent, LustIncidentCreateComponent
      , LustIncidentEditComponent];




