// import { Component, OnInit, Inject, OnDestroy, OnChanges, ViewChild } from '@angular/core';
import { Component, Inject, ViewChild, TemplateRef, ViewContainerRef
  , ComponentRef, OnDestroy,  OnInit, ComponentFactoryResolver, Output, EventEmitter } from '@angular/core';


import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectedDataService } from '../services/selected-data.service';
import { ContactSearchResultStat } from '../../models/contact-search-result-stat';
import { Subscription } from 'rxjs';
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


