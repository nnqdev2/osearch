import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ust-search-dialog',
  templateUrl: './ust-search-dialog.component.html',
  styleUrls: ['./ust-search-dialog.component.css']
})
export class UstSearchDialogComponent  {

  constructor(
    private dialogRef: MatDialogRef<UstSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}