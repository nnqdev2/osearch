import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Observable, Subject, BehaviorSubject} from 'rxjs';
import { map, flatMap} from 'rxjs/operators';
import { LustDataService } from '../../../services/lust-data.service';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GuardDialogComponent } from '../../../common/dialogs/guard-dialog.component';
import { SubmitStatusDialogComponent } from '../../../common/dialogs/submit-status-dialog.component';
import { SiteAlias } from '../../../models/site-alias';
import { SiteAliasPost } from '../../../models/site-alias-post';
import { ConfirmDeleteDialogComponent } from '../../confirm-delete-dialog/confirm-delete-dialog.component';
import { DatePipe } from '@angular/common';
import { IncidentIdToNameService } from '../../../olprr-search/incident-id-to-name.service';

@Component({
  selector: 'app-site-alias-edit',
  templateUrl: './site-alias-edit.component.html',
  styleUrls: ['./site-alias-edit.component.scss']
})
export class SiteAliasEditComponent implements OnInit {
  // @Input() siteAlias: SiteAlias;

  guardDialogRef: MatDialogRef<GuardDialogComponent, any>;
  submitStatusDialogRef: MatDialogRef<SubmitStatusDialogComponent, any>;
  confirmDeleteDialogRef: MatDialogRef<ConfirmDeleteDialogComponent, any>;

  private incidentForm: FormGroup;
  private siteAlias: SiteAlias;

  currentDate: Date;
  errorMessage: string;
  private isActionSeleted = false;
  private submitClicked = false;
  private resetFormClicked = false;
  private helpClicked = false;
  private cancelClicked = false;
  private showAllErrorsMessages = false;
  private errors: any[];
  private lustId = 0;
  private siteNameAliasId = 0;
  private isUpdate = false;

  private siteAliasPost = new SiteAliasPost();
  private siteAliasPostResult = new SiteAliasPost();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private isClosed = true;

  maxDate: Date;

  constructor(private lustDataService: LustDataService, private formBuilder: FormBuilder
    , private datePipe: DatePipe, private route: ActivatedRoute, private router: Router
    , private canDeactivateDialog: MatDialog, private confirmDeleteDialog: MatDialog
    , private submitStatusDialog: MatDialog, private idToNameService: IncidentIdToNameService
  ) {  }

  ngOnInit() {
    this.loadingSubject.next(true);
    this.route.data.subscribe((data: {siteAlias: SiteAlias}) => {this.siteAlias = data.siteAlias; });

    console.log('***SiteAliasEditComponent ngOnInit() DEBUGGING******');
    const url = this.router.url;

    this.route.pathFromRoot[2].params.subscribe(params => {
      this.lustId = +params['lustid'];
      console.log(this.lustId);
    });

    this.route.params.subscribe(params => {
      this.siteNameAliasId = +params['sitenamealiasid'];
      console.log(this.siteNameAliasId);
    });

    this.isUpdate = true;
    if (isNaN(this.siteNameAliasId)) {
      console.log('ADD New alias....');
      this.isUpdate = false;
      this.siteNameAliasId = 0;
    }

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
          // lastChangeDate:  [{value: this.siteAlias.lastChangeDate, disabled: true}],
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
    if  (this.helpClicked) {
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
            console.log('****findInvalidControls ' + field);
            console.log(this.incidentForm.controls[field]);
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
    console.log('submitSiteAlias() starts................................. ');

    this.submitClicked = true;
    if (this.incidentForm.dirty && this.incidentForm.valid) {

      this.siteAliasPost.siteNameAlias = this.incidentForm.controls.siteNameAlias.value;
      // this.siteAliasPost.lastChangeBy = this.incidentForm.controls.lastChangeBy.value;
      this.siteAliasPost.lastChangeBy = 'LUSTUSER';
      this.siteAliasPost.lustId = this.lustId;
      this.siteAliasPost.siteNameAliasIdIn = this.siteNameAliasId;

      console.log('submitSiteAlias()');
      console.log(this.siteAliasPost);

      this.lustDataService.insUpdSiteAlias(this.siteAliasPost)
        .subscribe(
          (data ) => (
            this.siteAliasPostResult = data,
            console.log('submitSiteAlias() this.siteAliasPostResult'),
            console.log(this.siteAliasPostResult),
            this.onCreateLustIncidentComplete()),
        );
    } else if (this.incidentForm.invalid) {
        this.errors = this.findInvalidControls();
        console.log('this.errors');
        console.log(this.errors);
        this.showAllErrorsMessages = true;
        this.isClosed = false;
    }
  }


  onCreateLustIncidentComplete(): void {
    console.log('onCreateLustIncidentComplete() ');

  }


}
