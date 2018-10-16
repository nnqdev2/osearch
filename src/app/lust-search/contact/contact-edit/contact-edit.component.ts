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
import { ContactType } from '../../../models/contact-type';
import { State } from '../../../models/state';
import { SearchDialogComponent } from '../../search-dialog/search-dialog.component';
import { ContactSearchResultStat } from '../../../models/contact-search-result-stat';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.scss']
})
export class ContactEditComponent implements OnInit {

  guardDialogRef: MatDialogRef<GuardDialogComponent, any>;
  submitStatusDialogRef: MatDialogRef<SubmitStatusDialogComponent, any>;
  confirmDeleteDialogRef: MatDialogRef<ConfirmDeleteDialogComponent, any>;
  searchDialogRef: MatDialogRef<SearchDialogComponent, any>;
  private contactForm: FormGroup;
  private contactAffilGet: ContactAffilGet;
  currentDate: Date;
  errorMessage: string;
  private contactTypes: ContactType[];
  private contactType2s: ContactType[];
  private theRealContactTypes: ContactType[];
  private states: State[];
  private apGetLogNumber: ApGetLogNumber;
  private submitClicked = false;
  private resetFormClicked = false;
  private formUpdated = false;
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
    , private route: ActivatedRoute, private router: Router, private searchDialog: MatDialog
    , private canDeactivateDialog: MatDialog, private idToNameService: IncidentIdToNameService
  ) {  }

  ngOnInit() {
    this.loadingSubject.next(true);
    this.route.data.subscribe((data: {contactTypes: ContactType[]}) => {this.contactTypes = data.contactTypes; });
    this.route.data.subscribe((data: {contactType2s: ContactType[]}) => {this.contactType2s = data.contactType2s; });
    this.route.data.subscribe((data: {states: State[]}) => {this.states = data.states; });

    this.route.pathFromRoot[2].params.subscribe(params => {
      this.lustId = +params['lustid'];
    });
    this.route.params.subscribe(params => {
      this.affilId = +params['affilid'];
    });
    if (isNaN(this.affilId)) {
      this.isUpdate = false;
      this.affilId = 0;
      this.formTitle = 'Add New Contact for Log Number ';
      this.route.data.subscribe((data: {apGetLogNumber: ApGetLogNumber}) => {
        this.apGetLogNumber = data.apGetLogNumber;
        this.logNumber = this.apGetLogNumber.logNumber;
        this.setContactTypes(this.apGetLogNumber.releaseType);
        this.buildAddForm();
      });
    } else {
      this.route.data.subscribe((data: {contactAffilGet: ContactAffilGet}) => {
        this.contactAffilGet = data.contactAffilGet; this.logNumber = this.contactAffilGet.logNumber;
        this.isUpdate = true;
        this.formTitle = 'Update Contact Details for Log Number ';
        this.setContactTypes(this.contactAffilGet.releaseType);
        this.buildUpdateForm();
      });
    }
    this.formTitle = this.formTitle + this.logNumber;
    this.returnPath = 'lust/' + this.lustId + '/contacts';
    this.maxDate = new Date();
    this.maxDate.setDate( this.maxDate.getDate());
    this.loadingSubject.next(false);
  }

  private setContactTypes(releaseType: string) {
    if (releaseType === 'H') {
      this.theRealContactTypes = this.contactType2s;
    } else {
      this.theRealContactTypes = this.contactTypes;
    }
  }

  private buildUpdateForm() {
    this.contactForm = this.formBuilder.group({
      affilTypeCd: [this.contactAffilGet.affilTypeCd, Validators.required],
      startDt: [this.contactAffilGet.startDt, Validators.required],
      endDt:   [this.contactAffilGet.endDt],
      firstName: [this.contactAffilGet.firstName, Validators.required],
      lastName: [this.contactAffilGet.lastName, Validators.required],
      organization:   [this.contactAffilGet.organization, Validators.required],
      subOrganization:   [this.contactAffilGet.subOrganization],
      jobTitle: [this.contactAffilGet.jobTitle],
      street: [this.contactAffilGet.street, Validators.required],
      city:   [this.contactAffilGet.city, Validators.required],
      state: [this.contactAffilGet.state, Validators.required],
      zip: [this.contactAffilGet.zip, Validators.required],
      phone:   [this.contactAffilGet.phone, Validators.required],
      email:   [this.contactAffilGet.email, Validators.required],
      country:   [this.contactAffilGet.country, Validators.required],
      affilComments:   [this.contactAffilGet.affilComments],
    },
    {validator: [] }
    );
  }

  private buildAddForm() {
    this.contactForm = this.formBuilder.group({
      affilTypeCd: ['', Validators.required],
      startDt: ['', Validators.required],
      endDt:   [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      organization:   ['', Validators.required],
      subOrganization:   [''],
      jobTitle: [''],
      street: ['', Validators.required],
      city:   ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      phone:   ['', Validators.required],
      email:   ['', Validators.required],
      country:   ['', Validators.required],
      affilComments:   [''],
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
    if (
      (this.isActionSelected()) ||
      (this.contactForm.pristine  && !this.formUpdated)
    ) {
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

  submit(): void {
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
      this.contactAffilPost.jobTitle = this.contactForm.controls.jobTitle.value;
      this.contactAffilPost.city = this.contactForm.controls.city.value;
      this.contactAffilPost.phone = this.contactForm.controls.phone.value;
      this.contactAffilPost.email = this.contactForm.controls.email.value;
      this.contactAffilPost.lustId = this.lustId;
      this.contactAffilPost.affilId = this.affilId;
      this.contactAffilPost.zip = this.contactForm.controls.zip.value;
      this.contactAffilPost.country = this.contactForm.controls.country.value;
      this.contactAffilPost.state = this.contactForm.controls.state.value;
      this.contactAffilPost.lastChangedBy = 'LUSTUSER';
      console.log('update contact........');
      console.log(this.contactAffilPost);
      console.log(JSON.stringify(this.contactAffilPost));
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


  private openContactSearch() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    // dialogConfig.disableClose =  true;
    dialogConfig.data = {
      searchType: 'Contact',
    };
    this.searchDialogRef = this.searchDialog.open(SearchDialogComponent, dialogConfig);
    this.searchDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.updateContact(result);
      }
    });
  }

  private updateContact(contactSearchResultStat: ContactSearchResultStat) {
    this.contactForm.controls.street.setValue(contactSearchResultStat.street);
    this.contactForm.controls.city.setValue(contactSearchResultStat.city);
    this.contactForm.controls.state.setValue(contactSearchResultStat.state);
    this.contactForm.controls.firstName.setValue(contactSearchResultStat.firstName);
    this.contactForm.controls.lastName.setValue(contactSearchResultStat.lastName);
    this.contactForm.controls.organization.setValue(contactSearchResultStat.organization);
    this.contactForm.controls.country.setValue(contactSearchResultStat.country);
    this.contactForm.controls.phone.setValue(contactSearchResultStat.phone);
    this.contactForm.controls.email.setValue(contactSearchResultStat.email);
    this.contactForm.controls.zip.setValue(contactSearchResultStat.zipcode);
    this.contactForm.controls.subOrganization.setValue(contactSearchResultStat.subOrganization);
    this.formUpdated = true;
  }




}
