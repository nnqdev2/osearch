import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-guard-dialog',
  templateUrl: './guard-dialog.component.html',
  styleUrls: ['./guard-dialog.component.css']
})
export class GuardDialogComponent  {

  constructor(
    private dialogRef: MatDialogRef<GuardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
