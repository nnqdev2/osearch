import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteTypesResolver } from '../resolvers/site-types-resolver.service';
import { FileStatusesResolver } from '../resolvers/file-statuses-resolver.service';
import { ZipCodesResolver } from '../resolvers/zipcodes-resolver.service';
import { CitiesResolver } from '../resolvers/cities-resolver.service';
import { CountiesResolver } from '../resolvers/counties-resolver.service';
import { ConfirmationTypesResolver } from '../resolvers/confirmation-types-resolver.service';
import { DiscoveryTypesResolver } from '../resolvers/discovery-types-resolver.service';
import { ReleaseCauseTypesResolver } from '../resolvers/release-cause-types-resolver.service';
import { SourceTypesResolver } from '../resolvers/source-types-resolver.service';
import { StatesResolver } from '../resolvers/states-resolver.service';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { LustIncidentCreateComponent } from './lust-incident-create/lust-incident-create.component';
import { LustIncidentEditComponent } from './lust-incident-edit/lust-incident-edit.component';
import { BrownfieldsResolver } from '../resolvers/brownfields-resolver.service';
import { SiteType2sResolver } from '../resolvers/site-type2s-resolver.service';
import { LustIncidentGetResolver } from '../resolvers/lust-incident-get-resolver.service';
import { LustIncidentComponent } from './lust-incident/lust-incident.component';
import { InspectionComponent } from './inspection/inspection.component';
import { ProjectManagerComponent } from './project-manager/project-manager.component';
import { WorkReportedComponent } from './work-reported/work-reported.component';
import { PetroleumContaminatedSoilComponent } from './petroleum-contaminated-soil/petroleum-contaminated-soil.component';
import { SiteControlComponent } from './site-control/site-control.component';
import { PublicNoticeComponent } from './public-notice/public-notice.component';
import { SitePhotoComponent } from './site-photo/site-photo.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { EnforcementComponent } from './enforcement/enforcement.component';
import { SiteAliasEditComponent } from './site-alias/site-alias-edit/site-alias-edit.component';
import { SiteAliasesComponent } from './site-alias/site-aliases/site-aliases.component';
import { LustSearchComponent } from './lust-search/lust-search.component';
import { SiteAliasBaseComponent } from './site-alias/site-alias-base/site-alias-base.component';
import { SiteAliasResolver } from '../resolvers/site-alias-resolver.service';
import { LogNumberResolver } from '../resolvers/log-number-resolver.service';
import { ContactsComponent } from './contact/contacts/contacts.component';
import { ContactBaseComponent } from './contact/contact-base/contact-base.component';
import { ContactEditComponent } from './contact/contact-edit/contact-edit.component';

const routes: Routes = [
  { path: '', component: LustSearchComponent,
      children: [
        { path: '', component: LustIncidentCreateComponent,
            resolve: {
              siteTypes: SiteTypesResolver,
              confirmationTypes: ConfirmationTypesResolver,
              counties: CountiesResolver,
              cities: CitiesResolver,
              discoveryTypes: DiscoveryTypesResolver,
              releaseCauseTypes: ReleaseCauseTypesResolver,
              sourceTypes: SourceTypesResolver,
              states: StatesResolver,
              zipCodes: ZipCodesResolver,
            },
            canDeactivate: [CanDeactivateGuard]
        },
      ]
    },
    { path: ':lustid', component: LustIncidentComponent,
      children: [
        {path: '', component: LustIncidentEditComponent,
          resolve: {
            siteTypes: SiteTypesResolver,
            siteType2s: SiteType2sResolver,
            fileStatuses: FileStatusesResolver,
            brownfields: BrownfieldsResolver,
            counties: CountiesResolver,
            cities: CitiesResolver,
            zipCodes: ZipCodesResolver,
            lustIncidentGet: LustIncidentGetResolver,
          },
          canDeactivate: [CanDeactivateGuard],
        },
        {path: 'sitealiases', component: SiteAliasesComponent,
          resolve: {
            apGetLogNumber: LogNumberResolver,
          },
        },
        {path: 'sitealias', component: SiteAliasBaseComponent,
          children:
          [
            {path: '', component: SiteAliasEditComponent,
              resolve: {
                apGetLogNumber: LogNumberResolver,
              },
              canDeactivate: [CanDeactivateGuard],
            },
            {path: ':sitenamealiasid', component: SiteAliasEditComponent,
              resolve: {
                siteAlias: SiteAliasResolver,
              },
              canDeactivate: [CanDeactivateGuard],
            },
          ]
        },
        {path: 'contacts', component: ContactsComponent,
          resolve: {
            apGetLogNumber: LogNumberResolver,
          },
        },
        {path: 'contact', component: ContactBaseComponent,
          children:
          [
            {path: '', component: ContactEditComponent,
              resolve: {
                apGetLogNumber: LogNumberResolver,
              },
              canDeactivate: [CanDeactivateGuard],
            },
            {path: ':affilid', component: ContactEditComponent,
              resolve: {
                // siteAlias: SiteAliasResolver,
              },
              canDeactivate: [CanDeactivateGuard],
            },
          ]
        },
        {path: 'assessment', component: AssessmentComponent},
        {path: 'projectmanager', component: ProjectManagerComponent},
        {path: 'workreported', component: WorkReportedComponent},
        {path: 'petcontsoil', component: PetroleumContaminatedSoilComponent},
        {path: 'inspection', component: InspectionComponent},
        {path: 'sitecontrol', component: SiteControlComponent},
        {path: 'publicnotice', component: PublicNoticeComponent},
        {path: 'enforcement', component: EnforcementComponent},
        {path: 'sitephoto', component: SitePhotoComponent},
        {path: 'enforcement', component: EnforcementComponent},
      ]
    },

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LustSearchRoutingModule { }
