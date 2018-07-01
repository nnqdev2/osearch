import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IncidentData } from '../models/incident-data';

import { AddressCorrect } from '../models/address-correct';
import { PostalCountyVerification } from '../models/postal-county-verification';


@Component({
  selector: 'app-accept-dialog',
  templateUrl: './accept-dialog.component.html',
  styleUrls: ['./accept-dialog.component.css']
})
export class AcceptDialogComponent implements OnInit {

  form: FormGroup;
  // olprrId: number;
  // siteAddress: string;
  // siteCity: string;
  // siteZipcode: number;
  // countyFips: string;
  incidentData: IncidentData;
  addressCorrect: AddressCorrect;
  postalCountyVerification: PostalCountyVerification;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AcceptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data ) {}
    // @Inject(MAT_DIALOG_DATA) incidentData: IncidentData, addressCorrect: AddressCorrect
    // , postalCountyVerification: PostalCountyVerification) {
    //   this.incidentData = incidentData;
    //   this.addressCorrect = addressCorrect;
    //   this.postalCountyVerification = postalCountyVerification;
    // }

  ngOnInit() {

  //   this.form = this.fb.group({
  //     siteAddress:  [{value: 'test', disabled: true}],
  //     siteCity:  [{value: 'testcity', disabled: true}],
  //     siteZipcode: [{value: 1234, disabled: true}],
  //     countyFips: [{value: 96999, disabled: true}],
  // });

    this.form = this.fb.group({
      siteAddress:  [{value: this.data.incidentData.siteAddress, disabled: true}],
      siteCity:  [{value: this.data.incidentData.siteCity, disabled: true}],
      siteState:  [{value: 'OR', disabled: true}],
      siteZipcode: [{value: this.data.incidentData.siteZipcode, disabled: true}],
      countyFips: [{value: this.data.postalCountyVerification.countyCode, disabled: true}],
    });
  }


  save() {
      this.dialogRef.close(this.form.value);
  }

  close() {
      this.dialogRef.close();
  }

}
