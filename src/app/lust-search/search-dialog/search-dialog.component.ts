import { Component, OnInit, Inject, OnDestroy, OnChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectedDataService } from '../services/selected-data.service';
import { ContactSearchResultStat } from '../../models/contact-search-result-stat';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnChanges, OnDestroy  {
  contactSubscription: Subscription;
  selectedContact: ContactSearchResultStat;
  ngOnChanges(): void {
    console.log(`*************this.selectedContact:`);
    this.contactSubscription = this.selectedDataService.contactDataSelected$.subscribe(selectedData => {
      this.selectedContact = selectedData;
      console.log(`this.selectedContact: ${this.selectedContact}`);


    });
  }



  constructor(
    private dialogRef: MatDialogRef<SearchDialogComponent>,  private selectedDataService: SelectedDataService
    , @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    console.log('****onNoClick()');
    this.dialogRef.close();
  }

  public onSelected(contact: ContactSearchResultStat) {
    console.log('HELLO?????????????????');
    console.log(`onSelected(event: Event) ${contact}`);

  }

  ngOnDestroy() {
    this.contactSubscription.unsubscribe();
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


