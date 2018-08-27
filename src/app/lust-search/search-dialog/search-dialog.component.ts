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

  // @ViewChild('target', { read: ViewContainerRef }) vcRef: ViewContainerRef;

  // componentRef: ComponentRef<any>;

  @Output() contactSelected = new EventEmitter<ContactSearchResultStat>();

  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    // private resolver: ComponentFactoryResolver,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // console.log('HELLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLPPPPPPPPPpppp');
    // console.log(this.data.component);
    // const factory = this.resolver.resolveComponentFactory(this.data.component);
    // this.componentRef = this.vcRef.createComponent(factory);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    // if (this.componentRef) {
    //   this.componentRef.destroy();
    // }
  }

  // onSelected(data: any) {
  //   console.log('********** search dialog ');
  //   console.log(data);
  //   // console.log('*****searchDialog emitting event.....');
  //   // this.rowSelected.emit(data);
  //   this.dialogRef.close(data);
  // }

  onContactSelected(contactSearchResultStat: ContactSearchResultStat) {
    this.dialogRef.close(contactSearchResultStat);
  }

  onUstSelected(ustSearchResultStat: UstSearchResultStat) {
    this.dialogRef.close(ustSearchResultStat);
  }

}


