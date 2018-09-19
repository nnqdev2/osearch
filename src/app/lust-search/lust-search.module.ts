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
import { ContactComponent } from './contact/contact.component';
import { ProjectManagerComponent } from './project-manager/project-manager.component';
import { WorkReportedComponent } from './work-reported/work-reported.component';
import { PetroleumContaminatedSoilComponent } from './petroleum-contaminated-soil/petroleum-contaminated-soil.component';
import { InspectionComponent } from './inspection/inspection.component';
import { SiteControlComponent } from './site-control/site-control.component';
import { PublicNoticeComponent } from './public-notice/public-notice.component';
import { SitePhotoComponent } from './site-photo/site-photo.component';
import { EnforcementComponent } from './enforcement/enforcement.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { SiteAliasEditComponent } from './site-alias/site-alias-edit/site-alias-edit.component';
import { SiteAliasesComponent } from './site-alias/site-aliases/site-aliases.component';
import { LustSearchComponent } from './lust-search/lust-search.component';
import { SiteAliasBaseComponent } from './site-alias/site-alias-base/site-alias-base.component';
import { ContactsComponent } from './contact/contacts/contacts.component';
import { ContactBaseComponent } from './contact/contact-base/contact-base.component';
import { ContactEditComponent } from './contact/contact-edit/contact-edit.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    // BrowserAnimationsModule,
    MaterialModule,
    NgbModule.forRoot(),
    ShowErrorsModule,
    ShowAllMessagesModule,
    UstSearchModule,
    ContactSearchModule,
    LustSearchRoutingModule,
  ],
  // declarations: [LustSearchFilterComponent, LustSearchResultComponent,
  declarations: [ LustSearchComponent, LustIncidentCreateComponent, LustIncidentEditComponent, SearchDialogComponent
                , ConfirmDeleteDialogComponent, LustIncidentComponent, ContactComponent, ProjectManagerComponent
                , WorkReportedComponent, PetroleumContaminatedSoilComponent, InspectionComponent, SiteControlComponent
                , PublicNoticeComponent, SitePhotoComponent, EnforcementComponent, AssessmentComponent, SiteAliasEditComponent
                , SiteAliasesComponent, SiteAliasBaseComponent, ContactsComponent, ContactBaseComponent, ContactEditComponent ],
  entryComponents: [SearchDialogComponent, ConfirmDeleteDialogComponent ],
  // exports: [lustSearchRoutingComponents]
})
export class LustSearchModule { }
