import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorsRoutingModule } from './errors-routing.module';
import { ErrorsComponent } from './errors.component';
import { ErrorsDialogComponent } from './errors-dialog.component';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    ErrorsRoutingModule,
    MaterialModule,
  ],
  exports: [ErrorsComponent],
  declarations: [ErrorsComponent, ErrorsDialogComponent],
  entryComponents: [ErrorsDialogComponent],
})
export class ErrorsModule { }
