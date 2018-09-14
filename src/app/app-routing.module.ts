import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: 'lust', loadChildren: './lust-search/lust-search.module#LustSearchModule'
    // path: 'lust', loadChildren: () => LustSearchModule
  },
  { path: '', redirectTo: 'lsearch', pathMatch: 'full' }
,
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

