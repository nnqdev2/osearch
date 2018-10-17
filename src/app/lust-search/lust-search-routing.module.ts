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
import { AssessmentComponent } from './assessment/assessment.component';
import { SiteAliasEditComponent } from './site-alias/site-alias-edit/site-alias-edit.component';
import { SiteAliasesComponent } from './site-alias/site-aliases/site-aliases.component';
import { LustSearchComponent } from './lust-search/lust-search.component';
import { SiteAliasBaseComponent } from './site-alias/site-alias-base/site-alias-base.component';
import { SiteAliasResolver } from '../resolvers/site-alias-resolver.service';
import { LogNumberResolver } from '../resolvers/log-number-resolver.service';
import { ContactsComponent } from './contact/contacts/contacts.component';
import { ContactBaseComponent } from './contact/contact-base/contact-base.component';
import { ContactEditComponent } from './contact/contact-edit/contact-edit.component';
import { ContactTypesResolver } from '../resolvers/contact-types-resolver.service';
import { ContactType2sResolver } from '../resolvers/contact-type2s-resolver.service';
import { ContactResolver } from '../resolvers/contact-resolver.service';
import { LustHotcDecommComponent } from './lust-hotc-decomm/lust-hotc-decomm.component';
import { HotcDecommComponent } from './hotc-decomm/hotc-decomm.component';
import { ProjectManagersComponent } from './project-manager/project-managers/project-managers.component';
import { ProjectManagerBaseComponent } from './project-manager/project-manager-base/project-manager-base.component';
import { ProjectManagerEditComponent } from './project-manager/project-manager-edit/project-manager-edit.component';
import { WorkReportedsComponent } from './work-reported/work-reporteds/work-reporteds.component';
import { WorkReportedBaseComponent } from './work-reported/work-reported-base/work-reported-base.component';
import { WorkReportedEditComponent } from './work-reported/work-reported-edit/work-reported-edit.component';
import { PcssComponent } from './petroleum-contaminated-soil/pcss/pcss.component';
import { PcsBaseComponent } from './petroleum-contaminated-soil/pcs-base/pcs-base.component';
import { PcsEditComponent } from './petroleum-contaminated-soil/pcs-edit/pcs-edit.component';
import { SiteControlsComponent } from './site-control/site-controls/site-controls.component';
import { SiteControlBaseComponent } from './site-control/site-control-base/site-control-base.component';
import { SiteControlEditComponent } from './site-control/site-control-edit/site-control-edit.component';
import { PublicNoticesComponent } from './public-notice/public-notices/public-notices.component';
import { PublicNoticeBaseComponent } from './public-notice/public-notice-base/public-notice-base.component';
import { PublicNoticeEditComponent } from './public-notice/public-notice-edit/public-notice-edit.component';
import { SitePhotosComponent } from './site-photo/site-photos/site-photos.component';
import { SitePhotoBaseComponent } from './site-photo/site-photo-base/site-photo-base.component';
import { SitePhotoEditComponent } from './site-photo/site-photo-edit/site-photo-edit.component';

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
                contactTypes: ContactTypesResolver,
                contactType2s: ContactType2sResolver,
                states: StatesResolver,
              },
              canDeactivate: [CanDeactivateGuard],
            },
            {path: ':affilid', component: ContactEditComponent,
              resolve: {
                contactTypes: ContactTypesResolver,
                contactType2s: ContactType2sResolver,
                states: StatesResolver,
                contactAffilGet: ContactResolver,
              },
              canDeactivate: [CanDeactivateGuard],
            },
          ]
        },
        {path: 'assessment', component: AssessmentComponent},
        {path: 'projectmanagers', component: ProjectManagersComponent,
          resolve: {
            apGetLogNumber: LogNumberResolver,
          },
        },
        {path: 'projectmanager', component: ProjectManagerBaseComponent,
          children:
          [
            {path: '', component: ProjectManagerEditComponent,
              resolve: {
                apGetLogNumber: LogNumberResolver,
              },
              canDeactivate: [CanDeactivateGuard],
            },
            {path: ':pmid', component: ProjectManagerEditComponent,
              resolve: {

              },
              canDeactivate: [CanDeactivateGuard],
            },
          ]
        },
        {path: 'workreporteds', component: WorkReportedsComponent},
        {path: 'workreported', component: WorkReportedBaseComponent,
          children:
          [
            {path: '', component: WorkReportedEditComponent,
              resolve: {
                apGetLogNumber: LogNumberResolver,
              },
              canDeactivate: [CanDeactivateGuard],
            },
            {path: ':wrid', component: WorkReportedEditComponent,
              resolve: {

              },
              canDeactivate: [CanDeactivateGuard],
            },
          ]
        },
        {path: 'pcss', component: PcssComponent},
        {path: 'pcs', component: PcsBaseComponent,
          children:
          [
            {path: '', component: PcsEditComponent,
              resolve: {
                apGetLogNumber: LogNumberResolver,
              },
              canDeactivate: [CanDeactivateGuard],
            },
            {path: ':pcsid', component: PcsEditComponent,
              resolve: {

              },
              canDeactivate: [CanDeactivateGuard],
            },
          ]
        },
        {path: 'sitecontrols', component: SiteControlsComponent},
        {path: 'sitecontrol', component: SiteControlBaseComponent,
          children:
          [
            {path: '', component: SiteControlEditComponent,
              resolve: {
                apGetLogNumber: LogNumberResolver,
              },
              canDeactivate: [CanDeactivateGuard],
            },
            {path: ':scid', component: SiteControlEditComponent,
              resolve: {

              },
              canDeactivate: [CanDeactivateGuard],
            },
          ]
        },
        {path: 'publicnotices', component: PublicNoticesComponent},
        {path: 'publicnotice', component: PublicNoticeBaseComponent,
          children:
          [
            {path: '', component: PublicNoticeEditComponent,
              resolve: {
                apGetLogNumber: LogNumberResolver,
              },
              canDeactivate: [CanDeactivateGuard],
            },
            {path: ':pnid', component: PublicNoticeEditComponent,
              resolve: {

              },
              canDeactivate: [CanDeactivateGuard],
            },
          ]
        },
        {path: 'sitephotos', component: SitePhotosComponent},
        {path: 'sitephoto', component: SitePhotoBaseComponent,
          children:
          [
            {path: '', component: SitePhotoEditComponent,
              resolve: {
                apGetLogNumber: LogNumberResolver,
              },
              canDeactivate: [CanDeactivateGuard],
            },
            {path: ':spid', component: SitePhotoEditComponent,
              resolve: {

              },
              canDeactivate: [CanDeactivateGuard],
            },
          ]
        },
        {path: 'lhotcd', component: LustHotcDecommComponent},
        {path: 'hotcd', component: HotcDecommComponent},
      ]
    },

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LustSearchRoutingModule { }
