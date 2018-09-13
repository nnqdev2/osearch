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
import { ContactComponent } from './contact/contact.component';
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

const routes: Routes = [
  { path: '', component: LustSearchComponent,


  
  },
  { path: 'new', component: LustIncidentCreateComponent,
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
  { path: 'lust/:lustid', component: LustIncidentComponent,
      children:
      [
        {path: '', redirectTo: 'incident', pathMatch: 'full'},
        {path: 'incident', component: LustIncidentEditComponent,
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
          children:
          [
            {path: 'new-route', component: SiteAliasEditComponent,
              canDeactivate: [CanDeactivateGuard],
          },
            {path: 'updt-route/:siteNameAliasId', component: SiteAliasEditComponent,
              canDeactivate: [CanDeactivateGuard],
            },
          ]
        },
        {path: 'contact', component: ContactComponent},
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
// export const lustSearchRoutingComponents = [LustSearchFilterComponent, LustSearchResultComponent, LustIncidentCreateComponent
//       , LustIncidentEditComponent, SiteAliasComponent];







      // const routes: Routes = [
      //   { path: 'lsearch', component: LustSearchFilterComponent,
      //     resolve: {
      //       tankStatuses: TankStatusesResolver,
      //       fileStatuses: FileStatusesResolver,
      //       siteTypes: SiteTypesResolver,
      //       zipCodes: ZipCodesResolver,
      //       regions: RegionsResolver,
      //       cities: CitiesResolver,
      //       projectManagers: ProjectManagersResolver,
      //       dateCompares: DateComparesResolver,
      //       cleanupSiteTypes: CleanupSiteTypesResolver,
      //       counties: CountiesResolver,
      //     },
      //   },
      //   { path: 'lust/new', component: LustIncidentCreateComponent,
      //     resolve: {
      //       siteTypes: SiteTypesResolver,
      //       confirmationTypes: ConfirmationTypesResolver,
      //       counties: CountiesResolver,
      //       cities: CitiesResolver,
      //       discoveryTypes: DiscoveryTypesResolver,
      //       releaseCauseTypes: ReleaseCauseTypesResolver,
      //       sourceTypes: SourceTypesResolver,
      //       states: StatesResolver,
      //       zipCodes: ZipCodesResolver,
      //     },
      //     canDeactivate: [CanDeactivateGuard]
      //   },
      //   { path: 'lust/:lustid', component: LustIncidentComponent,
      //       children:
      //       [
      //         {path: '', redirectTo: 'incident', pathMatch: 'full'},
      //         {path: 'incident', component: LustIncidentEditComponent,
      //           resolve: {
      //             siteTypes: SiteTypesResolver,
      //             siteType2s: SiteType2sResolver,
      //             fileStatuses: FileStatusesResolver,
      //             brownfields: BrownfieldsResolver,
      //             counties: CountiesResolver,
      //             cities: CitiesResolver,
      //             zipCodes: ZipCodesResolver,
      //             lustIncidentGet: LustIncidentGetResolver,
      //           },
      //           canDeactivate: [CanDeactivateGuard],
      //         },
      //         {path: 'sitealiases', component: SiteAliasesComponent,
      //           children:
      //           [
      //             {path: 'new-route', component: SiteAliasEditComponent,
      //               canDeactivate: [CanDeactivateGuard],
      //           },
      //             {path: 'updt-route/:siteNameAliasId', component: SiteAliasEditComponent,
      //               canDeactivate: [CanDeactivateGuard],
      //             },
      //           ]
      //         },
      //         {path: 'contact', component: ContactComponent},
      //         {path: 'assessment', component: AssessmentComponent},
      //         {path: 'projectmanager', component: ProjectManagerComponent},
      //         {path: 'workreported', component: WorkReportedComponent},
      //         {path: 'petcontsoil', component: PetroleumContaminatedSoilComponent},
      //         {path: 'inspection', component: InspectionComponent},
      //         {path: 'sitecontrol', component: SiteControlComponent},
      //         {path: 'publicnotice', component: PublicNoticeComponent},
      //         {path: 'enforcement', component: EnforcementComponent},
      //         {path: 'sitephoto', component: SitePhotoComponent},
      //         {path: 'enforcement', component: EnforcementComponent},
      //       ]
      //     },
      //   ];
      
      // @NgModule({
      //   imports: [RouterModule.forChild(routes)],
      //   exports: [RouterModule]
      // })
      // export class LustSearchRoutingModule { }
      // export const lustSearchRoutingComponents = [LustSearchFilterComponent, LustSearchResultComponent, LustIncidentCreateComponent
      //       , LustIncidentEditComponent, SiteAliasComponent];