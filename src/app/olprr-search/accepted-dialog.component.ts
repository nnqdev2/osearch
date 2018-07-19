import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LustIncidentInsertResult } from '../models/lust-incident-insert-result';

@Component({
  selector: 'app-accepted-dialog',
  templateUrl: './accepted-dialog.component.html',
  styleUrls: ['./accepted-dialog.component.css']
})
export class AcceptedDialogComponent implements OnInit {
  showErrorMessage = false;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AcceptedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data ) {}

  ngOnInit() {
  }

  openOlprrSearch() {
      this.dialogRef.close('osearch');
  }

  openLust() {
      this.dialogRef.close('lsearch');
  }

}
