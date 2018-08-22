import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContactSearchFilterComponent } from './contact-search-filter.component';
import { ContactSearchResultComponent } from './contact-search-result.component';
const routes: Routes = [
  { path: 'csearch', component: ContactSearchFilterComponent,
    resolve: {
    },
  },
];
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class ContactSearchRoutingModule { }
export const contactSearchRoutingComponents = [ContactSearchFilterComponent, ContactSearchResultComponent];

