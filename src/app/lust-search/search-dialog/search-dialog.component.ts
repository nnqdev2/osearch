// import { Component, OnInit, Inject, OnDestroy, OnChanges, ViewChild } from '@angular/core';
import { Component, Inject, ViewChild, TemplateRef, ViewContainerRef
  , ComponentRef, OnDestroy,  OnInit, ComponentFactoryResolver, Output, EventEmitter } from '@angular/core';


import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectedDataService } from '../services/selected-data.service';
import { ContactSearchResultStat } from '../../models/contact-search-result-stat';
import { Subscription } from 'rxjs';

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
  //   // this.contactSelected.emit(data);
  //   this.dialogRef.close(data);
  // }

  onSelected(contactSearchResultStat: ContactSearchResultStat) {
    console.log('***** search dialog onSelected(contactSearchResultStat: ContactSearchResultStat)');
    console.log(contactSearchResultStat);
    // console.log('*****searchDialog emitting event.....');
    // this.contactSelected.emit(contactSearchResultStat);
    this.dialogRef.close(contactSearchResultStat);
  }

}






// export class SearchDialogComponent implements OnChanges, OnDestroy  {
//   contactSubscription: Subscription;
//   selectedContact: ContactSearchResultStat;
//   ngOnChanges(): void {
//     console.log(`*************this.selectedContact:`);
//     this.contactSubscription = this.selectedDataService.contactDataSelected$.subscribe(selectedData => {
//       this.selectedContact = selectedData;
//       console.log(`this.selectedContact: ${this.selectedContact}`);


//     });
//   }



//   constructor(
//     private dialogRef: MatDialogRef<SearchDialogComponent>,  private selectedDataService: SelectedDataService
//     , @Inject(MAT_DIALOG_DATA) public data: any) {}

//   onNoClick(): void {
//     console.log('****onNoClick()');
//     this.dialogRef.close();
//   }

//   public onSelected(contact: ContactSearchResultStat) {
//     console.log('HELLO?????????????????');
//     console.log(`onSelected(event: Event) ${contact}`);

//   }

//   ngOnDestroy() {
//     this.contactSubscription.unsubscribe();
//   }

// }


