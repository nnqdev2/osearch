import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UstSearchResultComponent } from './ust-search-result.component';
import { UstSearchFilterComponent } from './ust-search-filter.component';
import { CountiesResolver } from '../resolvers/counties-resolver.service';
import { CitiesResolver } from '../resolvers/cities-resolver.service';
import { ZipCodesResolver } from '../resolvers/zipcodes-resolver.service';

const routes: Routes = [
  { path: 'usearch', component: UstSearchFilterComponent,
      resolve: {
        counties: CountiesResolver,
        cities: CitiesResolver,
        zipCodes: ZipCodesResolver,
      }
  },
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UstSearchRoutingModule { }
export const ustSearchRoutingComponents = [UstSearchFilterComponent, UstSearchResultComponent];
