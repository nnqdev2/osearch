import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-accepted-dialog',
  templateUrl: './accepted-dialog.component.html',
  styleUrls: ['./accepted-dialog.component.css']
})
export class AcceptedDialogComponent implements OnInit {
  showErrorMessage = false;
  constructor(
    private dialogRef: MatDialogRef<AcceptedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) {}

  ngOnInit() {
  }

  openOlprrSearch() {
      this.dialogRef.close('osearch');
  }

  openLust() {
      this.dialogRef.close('lust');
  }

}
