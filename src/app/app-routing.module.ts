import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OlprrSearchFilterComponent } from './olprr-search/olprr-search-filter.component';
import { OlprrIncidentComponent } from './olprr-incident/olprr-incident.component';
import { AppNavComponent } from './app-nav/app-nav.component';
import { LustSearchFilterComponent } from './lust-search/lust-search-filter.component';
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
import { TankStatusesResolver } from './resolvers/tank-statuses-resolver.service';
import { FileStatusesResolver } from './resolvers/file-statuses-resolver.service';
import { ZipCodesResolver } from './resolvers/zipcodes-resolver.service';
import { RegionsResolver } from './resolvers/regions-resolver.service';
import { CitiesResolver } from './resolvers/cities-resolver.service';
import { DateComparesResolver } from './resolvers/date-compares-resolver.service';
import { ProjectManagersResolver } from './resolvers/project-managers-resolver.service';
import { CleanupSiteTypesResolver } from './resolvers/cleanup-site-types-resolver.service';
import { UstSearchFilterComponent } from './ust-search/ust-search-filter.component';
import { CanDeactivateGuard } from './guards/can-deactivate-guard.service';
import { SiteAliasComponent } from './lust-search/site-alias/site-alias.component';
import { ContactSearchFilterComponent } from './contact-search/contact-search-filter.component';

const routes: Routes = [
  { path: '', redirectTo: 'osearch', pathMatch: 'full' },
  { path: 'app', component: AppNavComponent  },
  // { path: 'osearch', component: OlprrSearchFilterComponent,
  //   resolve: {
  //     deqOffices: DeqOfficesResolver,
  //     incidentStatuses: IncidentStatusesResolver,
  //     siteTypes: SiteTypesResolver,
  //   },
  // },
  // { path: 'lsearch', component: LustSearchFilterComponent,
  //   resolve: {
  //     tankStatuses: TankStatusesResolver,
  //     fileStatuses: FileStatusesResolver,
  //     siteTypes: SiteTypesResolver,
  //     zipCodes: ZipCodesResolver,
  //     regions: RegionsResolver,
  //     cities: CitiesResolver,
  //     counties: CountiesResolver,
  //     projectManagers: ProjectManagersResolver,
  //     dateCompares: DateComparesResolver,
  //     cleanupSiteTypes: CleanupSiteTypesResolver,
  //   },
  // },
  // { path: 'usearch', component: UstSearchFilterComponent,
  //   resolve: {
  //     counties: CountiesResolver,
  //     cities: CitiesResolver,
  //     zipCodes: ZipCodesResolver,
  //   }
  // },
  // { path: 'csearch', component: ContactSearchFilterComponent,
  // },
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
  { path: 'sitealias/37067', component: SiteAliasComponent, }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// export const routingComponents = [AppNavComponent, OlprrIncidentComponent];
// export const routingComponents = [AppNavComponent, OlprrSearchFilterComponent
//   , OlprrSearchResultComponent, OlprrReviewComponent, OlprrIncidentComponent, LustSearchFilterComponent
//   , LustSearchResultComponent, UstSearchFilterComponent,  UstSearchResultComponent];


