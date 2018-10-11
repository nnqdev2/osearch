import { Component, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-show-errors',
  templateUrl: './show-errors.component.html',
  styleUrls: ['./show-errors.component.css']
})
export class ShowErrorsComponent {

  private static readonly errorMessages = {
    'required': () => 'Required.',
    'email': () => 'Valid Email required.',
    'minlength': (params) => 'The min number of characters is ' + params.requiredLength,
    'maxlength': (params) => 'The max allowed number of characters is ' + params.requiredLength,
    'pattern': (params) => 'The required pattern is: ' + params.requiredPattern,
    'years': (params) => params.message,
    'countryCity': (params) => params.message,
    'uniqueName': (params) => params.message,
    'telephoneNumbers': (params) => params.message,
    'telephoneNumber': (params) => params.message,
    'selectOneOrMoreMedias': 'Must select one or more Medias.',
    'selectOneOrMoreContaminants': 'Must select one or more Contaminants.',
    'matDatepickerParse': () => 'Required. ' ,
    'noValidAddress': () => 'No Valid Address and Site Address cannot both contain values',
    'receivedDateAfterCloseDate' : () => 'Received Date cannot be after all dates',
    'siteNoValidAddressMissing' : () => 'A Street, City, County, and Zip Code is necessary - or No Valid Address must be checked.',
    'orgNameNameMissing' : () => 'First/Last Name OR Organization Name is required',
  };

  @Input()
  private control: AbstractControlDirective | AbstractControl;
  @Input()
  private submitClicked: boolean;

  shouldShowErrors(): boolean {
    return this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched || this.submitClicked);
  }

  listOfErrors(): string[] {
    // console.log('****** ShowErrorsComponent listOfErrors() ');
    // console.log(this.control);
    return Object.keys(this.control.errors)
      .map(
        field =>  this.getMessage(field, this.control.errors[field])
      );
  }

  private getMessage(type: string, params: any) {
    // console.log('****** ShowErrorsComponent getMessage(type: string, params: any) ');
    // console.log(type);
    // console.log(params);
    return ShowErrorsComponent.errorMessages[type](params);
  }

}
