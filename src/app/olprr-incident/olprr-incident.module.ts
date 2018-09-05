
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../shared/material.module';
import { ShowErrorsModule } from '../show-errors/show-errors.module';
import { ShowAllMessagesModule } from '../show-all-messages/show-all-messages.module';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { OlprrIncidentComponent } from './olprr-incident.component';
import { CommonModule } from '@angular/common';
import { OlprrIncidentRoutingModule, olprrIncidentRoutingComponents } from './olprr-incident-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    ShowErrorsModule,
    ShowAllMessagesModule,
    OlprrIncidentRoutingModule
  ],
  declarations: [
    OlprrIncidentComponent,
  ],
  exports: [olprrIncidentRoutingComponents],
  providers: [
    CanDeactivateGuard,
  ]
})
export class OlprrIncidentModule { }
