import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'lust', loadChildren: './lust-search/lust-search.module#LustSearchModule'
    // path: 'lust', loadChildren: () => LustSearchModule
  },
  { path: '', redirectTo: 'osearch', pathMatch: 'full' }
,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

