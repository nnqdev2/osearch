import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowAllMessagesComponent } from './show-all-messages.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ShowAllMessagesComponent],
  exports: [ShowAllMessagesComponent],
})
export class ShowAllMessagesModule { }
