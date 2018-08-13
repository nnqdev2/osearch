import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LustIncidentRoutingModule } from './lust-incident-routing.module';
import { SiteAliasComponent } from './site-alias/site-alias.component';

@NgModule({
  imports: [
    CommonModule,
    LustIncidentRoutingModule
  ],
  declarations: [SiteAliasComponent]
})
export class LustIncidentModule { }
