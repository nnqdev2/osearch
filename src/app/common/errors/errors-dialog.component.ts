import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-errors-dialog',
  templateUrl: './errors-dialog.component.html',
  styleUrls: ['./errors-dialog.component.scss']
})
export class ErrorsDialogComponent implements OnInit {

  message: string ;
  callback: () => void;

  constructor(
    private dialogRef: MatDialogRef<ErrorsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) {}

  ngOnInit() {
  }

  onClick() {
    this.dialogRef.close();
    if (this.data.callback) {
        this.data.callback();
    }
}
}
