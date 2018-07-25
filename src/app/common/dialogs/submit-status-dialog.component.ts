import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-submit-status-dialog',
  templateUrl: './submit-status-dialog.component.html',
  styleUrls: ['./submit-status-dialog.component.css']
})
export class SubmitStatusDialogComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SubmitStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) {}

  ngOnInit() {
  }

}
