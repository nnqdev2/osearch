import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from '../shared/material.module';

import { LustSearchRoutingModule, lustSearchRoutingComponents } from './lust-search-routing.module';
import { LustSearchFilterComponent } from './lust-search-filter.component';
import { LustSearchResultComponent } from './lust-search-result.component';
import { LustIncidentCreateComponent } from './lust-incident-create/lust-incident-create.component';
import { LustIncidentEditComponent } from './lust-incident-edit/lust-incident-edit.component';
import { ShowAllMessagesModule } from '../show-all-messages/show-all-messages.module';
import { ShowErrorsModule } from '../show-errors/show-errors.module';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';
import { UstSearchModule } from '../ust-search/ust-search.module';
import { SiteAliasComponent } from './site-alias/site-alias.component';
import { ContactSearchRoutingModule } from '../contact-search/contact-search-routing.module';
import { ContactSearchModule } from '../contact-search/contact-search.module';
import { ContactSearchFilterComponent } from '../contact-search/contact-search-filter.component';
import { ContactSearchResultComponent } from '../contact-search/contact-search-result.component';
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


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgbModule.forRoot(),
    ShowErrorsModule,
    ShowAllMessagesModule,
    LustSearchRoutingModule,
    UstSearchModule,
    ContactSearchModule,
  ],
  declarations: [lustSearchRoutingComponents, LustIncidentCreateComponent, LustIncidentEditComponent, SearchDialogComponent
                , ConfirmDeleteDialogComponent, SiteAliasComponent, LustIncidentComponent, ContactComponent, ProjectManagerComponent, WorkReportedComponent, PetroleumContaminatedSoilComponent, InspectionComponent, SiteControlComponent, PublicNoticeComponent, SitePhotoComponent, EnforcementComponent, AssessmentComponent, ],
  entryComponents: [SearchDialogComponent, ConfirmDeleteDialogComponent ],
  exports: [lustSearchRoutingComponents]
})
export class LustSearchModule { }


