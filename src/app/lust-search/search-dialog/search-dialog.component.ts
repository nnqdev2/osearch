import { Component, Inject, OnDestroy,  OnInit, Output, EventEmitter } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ContactSearchResultStat } from '../../models/contact-search-result-stat';
import { UstSearchResultStat } from '../../models/ust-search-result-stat';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit, OnDestroy  {

  @Output() contactSelected = new EventEmitter<ContactSearchResultStat>();

  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
  }

  onContactSelected(contactSearchResultStat: ContactSearchResultStat) {
    this.dialogRef.close(contactSearchResultStat);
  }

  onUstSelected(ustSearchResultStat: UstSearchResultStat) {
    this.dialogRef.close(ustSearchResultStat);
  }

}


