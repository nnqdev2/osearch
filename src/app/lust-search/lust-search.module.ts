import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../shared/material.module';

import { LustSearchRoutingModule} from './lust-search-routing.module';
import { LustIncidentCreateComponent } from './lust-incident-create/lust-incident-create.component';
import { LustIncidentEditComponent } from './lust-incident-edit/lust-incident-edit.component';
import { ShowAllMessagesModule } from '../show-all-messages/show-all-messages.module';
import { ShowErrorsModule } from '../show-errors/show-errors.module';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';
import { UstSearchModule } from '../ust-search/ust-search.module';
import { ContactSearchModule } from '../contact-search/contact-search.module';
import { LustIncidentComponent } from './lust-incident/lust-incident.component';
import { InspectionComponent } from './inspection/inspection.component';
import { EnforcementComponent } from './enforcement/enforcement.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { SiteAliasEditComponent } from './site-alias/site-alias-edit/site-alias-edit.component';
import { SiteAliasesComponent } from './site-alias/site-aliases/site-aliases.component';
import { LustSearchComponent } from './lust-search/lust-search.component';
import { SiteAliasBaseComponent } from './site-alias/site-alias-base/site-alias-base.component';
import { ContactsComponent } from './contact/contacts/contacts.component';
import { ContactBaseComponent } from './contact/contact-base/contact-base.component';
import { ContactEditComponent } from './contact/contact-edit/contact-edit.component';
import { LustHotcDecommComponent } from './lust-hotc-decomm/lust-hotc-decomm.component';
import { HotcDecommComponent } from './hotc-decomm/hotc-decomm.component';
import { ProjectManagerBaseComponent } from './project-manager/project-manager-base/project-manager-base.component';
import { ProjectManagerEditComponent } from './project-manager/project-manager-edit/project-manager-edit.component';
import { ProjectManagersComponent } from './project-manager/project-managers/project-managers.component';
import { WorkReportedBaseComponent } from './work-reported/work-reported-base/work-reported-base.component';
import { WorkReportedEditComponent } from './work-reported/work-reported-edit/work-reported-edit.component';
import { WorkReportedsComponent } from './work-reported/work-reporteds/work-reporteds.component';
import { PcsBaseComponent } from './petroleum-contaminated-soil/pcs-base/pcs-base.component';
import { PcsEditComponent } from './petroleum-contaminated-soil/pcs-edit/pcs-edit.component';
import { PcssComponent } from './petroleum-contaminated-soil/pcss/pcss.component';
import { SiteControlBaseComponent } from './site-control/site-control-base/site-control-base.component';
import { SiteControlEditComponent } from './site-control/site-control-edit/site-control-edit.component';
import { SiteControlsComponent } from './site-control/site-controls/site-controls.component';
import { PublicNoticesComponent } from './public-notice/public-notices/public-notices.component';
import { PublicNoticeEditComponent } from './public-notice/public-notice-edit/public-notice-edit.component';
import { PublicNoticeBaseComponent } from './public-notice/public-notice-base/public-notice-base.component';
import { SitePhotoBaseComponent } from './site-photo/site-photo-base/site-photo-base.component';
import { SitePhotoEditComponent } from './site-photo/site-photo-edit/site-photo-edit.component';
import { SitePhotosComponent } from './site-photo/site-photos/site-photos.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    NgbModule.forRoot(),
    ShowErrorsModule,
    ShowAllMessagesModule,
    UstSearchModule,
    ContactSearchModule,
    LustSearchRoutingModule,
  ],
  declarations: [ LustSearchComponent, LustIncidentCreateComponent, LustIncidentEditComponent, SearchDialogComponent
                , ConfirmDeleteDialogComponent, LustIncidentComponent
                , InspectionComponent, EnforcementComponent
                , AssessmentComponent, SiteAliasEditComponent, SiteAliasesComponent, SiteAliasBaseComponent
                , ContactsComponent, ContactBaseComponent, ContactEditComponent
                , LustHotcDecommComponent, HotcDecommComponent
                , ProjectManagerBaseComponent, ProjectManagerEditComponent, ProjectManagersComponent
                , WorkReportedBaseComponent, WorkReportedEditComponent, WorkReportedsComponent
                , PcsBaseComponent, PcsEditComponent, PcssComponent
                , SiteControlBaseComponent, SiteControlEditComponent, SiteControlsComponent
                , PublicNoticesComponent, PublicNoticeEditComponent, PublicNoticeBaseComponent
                , SitePhotoBaseComponent, SitePhotoEditComponent, SitePhotosComponent ],
  entryComponents: [SearchDialogComponent, ConfirmDeleteDialogComponent ],
})
export class LustSearchModule { }
