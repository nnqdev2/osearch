import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, BehaviorSubject} from 'rxjs';
import { LustDataService } from '../../../services/lust-data.service';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GuardDialogComponent } from '../../../common/dialogs/guard-dialog.component';
import { SubmitStatusDialogComponent } from '../../../common/dialogs/submit-status-dialog.component';
import { SiteAlias } from '../../../models/site-alias';
import { SiteAliasPost } from '../../../models/site-alias-post';
import { ConfirmDeleteDialogComponent } from '../../confirm-delete-dialog/confirm-delete-dialog.component';
import { IncidentIdToNameService } from '../../../olprr-search/incident-id-to-name.service';
import { ApGetLogNumber } from '../../../models/apGetLogNumber';

@Component({
  selector: 'app-site-alias-edit',
  templateUrl: './site-alias-edit.component.html',
  styleUrls: ['./site-alias-edit.component.scss']
})

export class SiteAliasEditComponent implements OnInit {
  guardDialogRef: MatDialogRef<GuardDialogComponent, any>;
  submitStatusDialogRef: MatDialogRef<SubmitStatusDialogComponent, any>;
  confirmDeleteDialogRef: MatDialogRef<ConfirmDeleteDialogComponent, any>;
  private incidentForm: FormGroup;
  private siteAlias: SiteAlias;
  currentDate: Date;
  errorMessage: string;
  private submitClicked = false;
  private resetFormClicked = false;
  private deleteClicked = false;
  private cancelClicked = false;
  private errors: any[];
  private lustId = 0;
  private siteNameAliasId = 0;
  private isUpdate = false;
  private returnPath: string;
  private logNumber: string;
  private formTitle: string;
  private siteAliasPost = new SiteAliasPost();
  private siteAliasPostResult = new SiteAliasPost();
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
      this.siteNameAliasId = +params['sitenamealiasid'];
    });
    const formTitle = 'Site Name Alias for Log Number ';
    if (isNaN(this.siteNameAliasId)) {
      this.isUpdate = false;
      this.siteNameAliasId = 0;
      this.formTitle = 'Add ' + formTitle;
      this.route.data.subscribe((data: {apGetLogNumber: ApGetLogNumber}) => {
        this.logNumber = data.apGetLogNumber.logNumber; });
    } else {
      this.route.data.subscribe((data: {siteAlias: SiteAlias}) => {
        this.siteAlias = data.siteAlias; this.logNumber = this.siteAlias.logNumber; });
      this.isUpdate = true;
      this.formTitle = 'Update ' + formTitle;
    }
    this.formTitle = this.formTitle + this.logNumber;
    this.returnPath = 'lust/' + this.lustId + '/sitealiases';
    if (this.isUpdate) {
      this.incidentForm = this.formBuilder.group({
        siteNameAlias: [this.siteAlias.siteNameAlias, Validators.required],
        lastChangeBy: [{value: this.siteAlias.lastChangeBy, disabled: true}],
        lastChangeDate:  [{value: this.siteAlias.lastChangeDate, disabled: true}],
      },
      {validator: [] }
      );
    } else {
        this.incidentForm = this.formBuilder.group({
          siteNameAlias: ['', Validators.required],
          // lastChangeBy: [{value: 'nquan', disabled: true}],
          // lastChangeDate:  [{value: this.contactAffil.lastChangeDate, disabled: true}],
        },
        {validator: [] }
        );
    }
    this.maxDate = new Date();
    this.maxDate.setDate( this.maxDate.getDate());
    this.loadingSubject.next(false);
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
    if (this.incidentForm.pristine  || this.isActionSelected() ) {
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
    for (const field of Object.keys(this.incidentForm.controls)) {
        if (this.incidentForm.controls[field].invalid) {
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
    if (this.incidentForm.dirty && this.incidentForm.valid) {

      this.siteAliasPost.siteNameAlias = this.incidentForm.controls.siteNameAlias.value;
      // this.siteAliasPost.lastChangeBy = this.incidentForm.controls.lastChangeBy.value;
      this.siteAliasPost.lastChangeBy = 'LUSTUSER';
      this.siteAliasPost.lustId = this.lustId;
      this.siteAliasPost.siteNameAliasIdIn = this.siteNameAliasId;
      this.lustDataService.insUpdSiteAlias(this.siteAliasPost)
        .subscribe(
          (data ) => (
            this.siteAliasPostResult = data,
            this.onCreateLustIncidentComplete()),
        );
    } else if (this.incidentForm.invalid) {
        this.errors = this.findInvalidControls();
        console.log('this.errors');
        console.log(this.errors);
    }
  }

  onCreateLustIncidentComplete(): void {
    this.router.navigate([this.returnPath]);
  }

  cancel() {
    this.cancelClicked = true;
    this.router.navigate([this.returnPath]);
  }

  delete() {
    this.deleteClicked = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm Delete',
      message1: 'Are you sure you want to delete Site Name Alias ' + this.siteAlias.siteNameAlias + ' ?' ,
    };
    dialogConfig.disableClose =  true;
    this.confirmDeleteDialogRef = this.confirmDeleteDialog.open(ConfirmDeleteDialogComponent, dialogConfig);
    this.confirmDeleteDialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.lustDataService.delSiteAlias(this.siteAlias.siteNameAliasId).subscribe();
        this.router.navigate([this.returnPath]);
      }
    });
  }

  resetForm() {
    this.resetFormClicked = true;
    this.incidentForm.reset();
    this.incidentForm.markAsPristine();
    if (this.isUpdate) {
      this.route.data.subscribe((data: {siteAlias: SiteAlias}) => {
        this.siteAlias = data.siteAlias; this.logNumber = this.siteAlias.logNumber;
        this.incidentForm = this.formBuilder.group({
          siteNameAlias: [this.siteAlias.siteNameAlias, Validators.required],
          lastChangeBy: [{value: this.siteAlias.lastChangeBy, disabled: true}],
          lastChangeDate:  [{value: this.siteAlias.lastChangeDate, disabled: true}],
        },
        {validator: [] }
        );
    });
    }
  }
}
