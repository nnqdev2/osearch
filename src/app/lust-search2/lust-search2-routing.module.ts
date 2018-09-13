import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TankStatusesResolver } from '../resolvers/tank-statuses-resolver.service';
import { LustSearchFilterComponent } from './lust-search-filter/lust-search-filter.component';
import { FileStatusesResolver } from '../resolvers/file-statuses-resolver.service';
import { SiteTypesResolver } from '../resolvers/site-types-resolver.service';
import { ZipCodesResolver } from '../resolvers/zipcodes-resolver.service';
import { RegionsResolver } from '../resolvers/regions-resolver.service';
import { CitiesResolver } from '../resolvers/cities-resolver.service';
import { ProjectManagersResolver } from '../resolvers/project-managers-resolver.service';
import { DateComparesResolver } from '../resolvers/date-compares-resolver.service';
import { CleanupSiteTypesResolver } from '../resolvers/cleanup-site-types-resolver.service';
import { CountiesResolver } from '../resolvers/counties-resolver.service';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LustSearch2RoutingModule { }
