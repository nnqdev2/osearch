import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss']
})
export class ConfirmDeleteDialogComponent implements OnInit {
  showErrorMessage = false;
  constructor(
    private dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) {}

  ngOnInit() {
  }

  confirm() {
      this.dialogRef.close('confirm');
  }

  cancel() {
      this.dialogRef.close('cancel');
  }

}
