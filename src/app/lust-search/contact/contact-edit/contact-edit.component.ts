import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { GuardDialogComponent } from '../../../common/dialogs/guard-dialog.component';
import { SubmitStatusDialogComponent } from '../../../common/dialogs/submit-status-dialog.component';
import { ConfirmDeleteDialogComponent } from '../../confirm-delete-dialog/confirm-delete-dialog.component';
import { ContactAffilPost } from '../../../models/contact-affil-post';
import { LustDataService } from '../../../services/lust-data.service';
import { IncidentIdToNameService } from '../../../olprr-search/incident-id-to-name.service';
import { ApGetLogNumber } from '../../../models/apGetLogNumber';
import { ContactAffilPostResult } from '../../../models/contact-affil-post-result';
import { ContactAffilGet } from '../../../models/contact-affil-get';
import { SiteType } from '../../../models/site-type';
import { SiteType2 } from '../../../models/site-type2';
import { ContactType } from '../../../models/contact-type';
import { State } from '../../../models/state';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.scss']
})
export class ContactEditComponent implements OnInit {

  guardDialogRef: MatDialogRef<GuardDialogComponent, any>;
  submitStatusDialogRef: MatDialogRef<SubmitStatusDialogComponent, any>;
  confirmDeleteDialogRef: MatDialogRef<ConfirmDeleteDialogComponent, any>;
  private contactForm: FormGroup;
  private contactAffilGet: ContactAffilGet;
  currentDate: Date;
  errorMessage: string;
  private contactTypes: ContactType[];
  private contactType2s: ContactType[];
  private states: State[];
  private submitClicked = false;
  private resetFormClicked = false;
  private deleteClicked = false;
  private cancelClicked = false;
  private errors: any[];
  private lustId = 0;
  private affilId = 0;
  private isUpdate = false;
  private returnPath: string;
  private logNumber: string;
  private formTitle: string;
  private contactAffilPost = new ContactAffilPost();
  private contactAffilPostResult: ContactAffilPostResult;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  
  maxDate: Date;

  constructor(private lustDataService: LustDataService, private formBuilder: FormBuilder
    , private route: ActivatedRoute, private router: Router
    , private canDeactivateDialog: MatDialog, private confirmDeleteDialog: MatDialog
    , private idToNameService: IncidentIdToNameService
  ) {  }

  ngOnInit() {
    this.loadingSubject.next(true);
    this.route.pathFromRoot[2].params.subscribe(params => {
      this.lustId = +params['lustid'];
    });
    this.route.params.subscribe(params => {
      this.affilId = +params['affilid'];
    });
    const formTitle = 'Contact for Log Number ';
    if (isNaN(this.affilId)) {
      this.isUpdate = false;
      this.affilId = 0;
      this.formTitle = 'Add ' + formTitle;
      this.route.data.subscribe((data: {apGetLogNumber: ApGetLogNumber}) => {
        this.logNumber = data.apGetLogNumber.logNumber; });
    } else {
      this.route.data.subscribe((data: {contactAffilGet: ContactAffilGet}) => {
        this.contactAffilGet = data.contactAffilGet; this.logNumber = this.contactAffilGet.logNumber; });
      this.isUpdate = true;
      this.formTitle = 'Update ' + formTitle;
    }
    this.formTitle = this.formTitle + this.logNumber;
    this.returnPath = 'lust/' + this.lustId + '/contacts';
    if (this.isUpdate) {
      this.buildUpdateForm();
    } else {
      this.buildAddForm();
    }
    this.maxDate = new Date();
    this.maxDate.setDate( this.maxDate.getDate());
    this.route.data.subscribe((data: {contactTypes: ContactType[]}) => {this.contactTypes = data.contactTypes; });
    this.route.data.subscribe((data: {contactType2s: ContactType[]}) => {this.contactType2s = data.contactType2s; });
    this.route.data.subscribe((data: {states: State[]}) => {this.states = data.states; });
    console.log('contact edit form init');
    console.log(this.contactTypes);
    console.log(this.contactType2s);
    console.log(this.states);

    this.loadingSubject.next(false);
  }

  private buildUpdateForm() {
    this.contactForm = this.formBuilder.group({
      affilTypeCd: [this.contactAffilGet.affilTypeCd, Validators.required],
      startDt: [this.contactAffilGet.startDt, Validators.required],
      endDt:   [this.contactAffilGet.endDt, Validators.required],
      firstName: [this.contactAffilGet.firstName, Validators.required],
      lastName: [this.contactAffilGet.lastName, Validators.required],
      organization:   [this.contactAffilGet.organization, Validators.required],
      subOrganization:   [this.contactAffilGet.subOrganization, Validators.required],
      jobtitle: [this.contactAffilGet.jobtitle, Validators.required],
      street: [this.contactAffilGet.street, Validators.required],
      city:   [this.contactAffilGet.city, Validators.required],
      state: [this.contactAffilGet.state, Validators.required],
      zip: [this.contactAffilGet.zip, Validators.required],
      phone:   [this.contactAffilGet.phone, Validators.required],
      email:   [this.contactAffilGet.email, Validators.required],
      country:   [this.contactAffilGet.country, Validators.required],
      affilComments:   [this.contactAffilGet.affilComments, Validators.required],
    },
    {validator: [] }
    );
  }
  private buildAddForm() {
    this.contactForm = this.formBuilder.group({
      affilTypeCd: ['', Validators.required],
      startDt: ['', Validators.required],
      endDt:   ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      organization:   ['', Validators.required],
      subOrganization:   ['', Validators.required],
      jobtitle: ['', Validators.required],
      street: ['', Validators.required],
      city:   ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      phone:   ['', Validators.required],
      email:   ['', Validators.required],
      country:   ['', Validators.required],
      affilComments:   ['', Validators.required],
    },
    {validator: [] }
    );
  }

  private isActionSelected(): boolean {
    if  (this.submitClicked) {
      return true;
    }
    if  (this.resetFormClicked) {
      return true;
    }
    if  (this.deleteClicked) {
      return true;
    }
    if  (this.cancelClicked) {
      return true;
    }
    return false;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.contactForm.pristine  || this.isActionSelected() ) {
      return true;
    }
    const choice: Subject<boolean> = new Subject<boolean>();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Discard changes?',
      message1: 'The form has not been Submitted yet, do you really want to leave page?',
      button1: 'Leave',
      button2: 'Stay'
    };
    this.guardDialogRef = this.canDeactivateDialog.open(GuardDialogComponent, dialogConfig);
    this.guardDialogRef.afterClosed().subscribe(result => {
      choice.next(result);
    });
    return choice;
  }

  private findInvalidControls() {
    const invalid = [];
    for (const field of Object.keys(this.contactForm.controls)) {
        if (this.contactForm.controls[field].invalid) {
            const name = this.idToNameService.getName(field);
            invalid.push(name + ' is required and must be valid.');
        }
    }

    // const contaminantErrorMessage = this.getContaminantErrorMessage();
    // if (contaminantErrorMessage != null) {
    //   invalid.push(contaminantErrorMessage);
    // }

    // const mediaErrorMessage = this.getMediaErrorMessage();
    // if (mediaErrorMessage != null) {
    //   invalid.push(mediaErrorMessage);
    // }

    return invalid;
  }


  submitSiteAlias(): void {
    this.submitClicked = true;
    if (this.contactForm.dirty && this.contactForm.valid) {

      this.contactAffilPost.affilType = this.contactForm.controls.affilTypeCd.value;
      this.contactAffilPost.startDt = this.contactForm.controls.startDt.value;
      this.contactAffilPost.endDt = this.contactForm.controls.endDt.value;
      this.contactAffilPost.firstName = this.contactForm.controls.firstName.value;
      this.contactAffilPost.lastName = this.contactForm.controls.lastName.value;
      this.contactAffilPost.street = this.contactForm.controls.street.value;
      this.contactAffilPost.organization = this.contactForm.controls.organization.value;
      this.contactAffilPost.subOrg = this.contactForm.controls.subOrganization.value;
      this.contactAffilPost.jobtitle = this.contactForm.controls.jobtitle.value;
      this.contactAffilPost.city = this.contactForm.controls.city.value;
      this.contactAffilPost.phone = this.contactForm.controls.phone.value;
      this.contactAffilPost.email = this.contactForm.controls.email.value;
      this.contactAffilPost.lustId = this.lustId;
      this.contactAffilPost.affilId = this.affilId;
      this.contactAffilPost.zip = this.contactForm.controls.zip.value;
      this.lustDataService.updateLustContact(this.contactAffilPost)
        .subscribe(
          (data ) => (
            this.contactAffilPostResult = data,
            this.onCreateComplete()),
        );
    } else if (this.contactForm.invalid) {
        this.errors = this.findInvalidControls();
        console.log('this.errors');
        console.log(this.errors);
    }
  }

  onCreateComplete(): void {
    this.router.navigate([this.returnPath]);
  }

  cancel() {
    this.cancelClicked = true;
    this.router.navigate([this.returnPath]);
  }

  // delete() {
  //   this.deleteClicked = true;
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.data = {
  //     title: 'Confirm Delete',
  //     message1: 'Are you sure you want to delete Site Name Alias ' + this.contactAffilGet.siteNameAlias + ' ?' ,
  //   };
  //   dialogConfig.disableClose =  true;
  //   this.confirmDeleteDialogRef = this.confirmDeleteDialog.open(ConfirmDeleteDialogComponent, dialogConfig);
  //   this.confirmDeleteDialogRef.afterClosed().subscribe(result => {
  //     if (result === 'confirm') {
  //       this.lustDataService.delSiteAlias(this.contactAffilGet.siteNameAliasId).subscribe();
  //       this.router.navigate([this.returnPath]);
  //     }
  //   });
  // }

  resetForm() {
    this.resetFormClicked = true;
    this.contactForm.reset();
    this.contactForm.markAsPristine();
    if (this.isUpdate) {
      this.route.data.subscribe((data: {contactAffilGet: ContactAffilGet}) => {
        this.contactAffilGet = data.contactAffilGet;
        this.buildUpdateForm();
    });
    }
  }
}
