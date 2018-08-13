import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteAliasComponent } from './site-alias/site-alias.component';

const routes: Routes = [
  { path: 'sitealias/:lustid', component: SiteAliasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LustIncidentRoutingModule { }
export const lustIncidentRoutingComponents = [SiteAliasComponent];


