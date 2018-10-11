import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Observable, Subject, BehaviorSubject, iif} from 'rxjs';
import { map, flatMap} from 'rxjs/operators';

import { LustDataService } from '../../services/lust-data.service';
import { SiteType } from '../../models/site-type';
import { ConfirmationType } from '../../models/confirmation-type';
import { DiscoveryType } from '../../models/discovery-type';
import { ReleaseCauseType } from '../../models/release-cause-type';
import { SourceType } from '../../models/source-type';
import { State } from '../../models/state';
import { AddressCorrectDataService } from '../../services/address-correct-data.service';
import { AddressCorrectStat } from '../../models/address-correct-stat';
import { AddressCorrect } from '../../models/address-correct';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GuardDialogComponent } from '../../common/dialogs/guard-dialog.component';
import { City } from '../../models/city';
import { ZipCode } from '../../models/zipcode';
import { County } from '../../models/county';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';
import { IncidentIdToNameService } from '../../olprr-search/incident-id-to-name.service';
import { PostalCountyLookup } from '../../models/postal-county-lookup';
import { SiteType2 } from '../../models/site-type2';
import { Brownfield } from '../../models/brownfield';
import { ProjectManager } from '../../models/project-manager';
import { LustIncidentGet } from '../../models/lust-incident-get';
import { FileStatus } from '../../models/file-status';
import { LustIncidentUpdateResult } from '../../models/lust-incident-update-Result';
import { LustIncidentUpdateUpdate } from '../../models/lust-incident-update-update';
import { SubmitStatusDialogComponent } from '../../common/dialogs/submit-status-dialog.component';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
@Component({
  selector: 'app-lust-incident-edit',
  templateUrl: './lust-incident-edit.component.html',
  styleUrls: ['./lust-incident-edit.component.scss']
})
export class LustIncidentEditComponent implements OnInit  {
  private guardDialogRef: MatDialogRef<GuardDialogComponent, any>;
  private searchDialogRef: MatDialogRef<SearchDialogComponent, any>;
  private submitStatusDialogRef: MatDialogRef<SubmitStatusDialogComponent, any>;
  private confirmDeleteDialogRef: MatDialogRef<ConfirmDeleteDialogComponent, any>;
  

  olprrId: number;
  lustIncidentGet: LustIncidentGet|null;
  private incidentForm: FormGroup;
  confirmationTypes: ConfirmationType[] = [];
  discoveryTypes: DiscoveryType[] = [];
  releaseCauseTypes: ReleaseCauseType[] = [];
  siteTypes: SiteType[] = [];
  siteType2s: SiteType2[] = [];
  brownfields: Brownfield[] = [];
  fileStatuses: FileStatus[] = [];
  projectManagers: ProjectManager[] = [];
  sourceTypes: SourceType[] = [];
  cities: City[] = [];
  states: State[] = [];
  zipcodes: ZipCode[] = [];
  counties: County[] = [];
  addressCorrectStat: AddressCorrectStat;
  addressCorrects: AddressCorrect[];
  addressCorrect: AddressCorrect;
  addressCorrectStatLoaded = false;
  postalCountyLookup: PostalCountyLookup|null;
  countyFips: string;
  leavePage: boolean;

  saAddressCorrectStat: AddressCorrectStat|null;
  rpAddressCorrectStat: AddressCorrectStat|null;
  icAddressCorrectStat: AddressCorrectStat|null;
  saAddressCorrect: AddressCorrect|null;

  currentDate: Date;
  showInvoiceContact = false;
  errorMessage: string;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  private submitClicked = false;
  private resetFormClicked = false;
  private searchClicked = false;

  private errors: any[];
  private showSaAddressCorrect = false;
  private showSaAddressCheck = false;


  private lustIncidentUpdate = new LustIncidentUpdateUpdate();
  private lustIncidentUpdateResult: LustIncidentUpdateResult;


  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  maxDate: Date;

  

  constructor(private lustDataService: LustDataService, private formBuilder: FormBuilder, private datePipe: DatePipe
    , private route: ActivatedRoute, private router: Router, private addressCorrectDataService: AddressCorrectDataService
    , private canDeactivateDialog: MatDialog, private submitStatusDialog: MatDialog, private confirmDeleteDialog: MatDialog
    , private idToNameService: IncidentIdToNameService
  ) {  }

  ngOnInit() {
    console.log('********************edit lust ngOnInit()');
    this.loadingSubject.next(true);
    this.route.data.subscribe((data: {lustIncidentGet: LustIncidentGet}) => {this.lustIncidentGet = data.lustIncidentGet;});
    this.route.data.subscribe((data: {projectManagers: ProjectManager[]}) => {this.projectManagers = data.projectManagers; });
    this.route.data.subscribe((data: {siteTypes: SiteType[]}) => {this.siteTypes = data.siteTypes; });
    this.route.data.subscribe((data: {siteType2s: SiteType2[]}) => {this.siteType2s = data.siteType2s; });
    this.route.data.subscribe((data: {brownfields: Brownfield[]}) => {this.brownfields = data.brownfields; });
    this.route.data.subscribe((data: {cities: City[]}) => {this.cities = data.cities; });
    this.route.data.subscribe((data: {zipCodes: ZipCode[]}) => {this.zipcodes = data.zipCodes; });
    this.route.data.subscribe((data: {counties: County[]}) => {this.counties = data.counties; });
    this.route.data.subscribe((data: {fileStatuses: FileStatus[]}) => {this.fileStatuses = data.fileStatuses; });
    this.createForm();
    this.maxDate = new Date();
    this.maxDate.setDate( this.maxDate.getDate());
    this.loadingSubject.next(false);
    this.OnScrollIntoView();

  }


  createForm() {
    console.log(this.lustIncidentGet);
    let pm;
    if (this.projectManagers !== undefined) {
      pm = this.projectManagers.pop();
    }
    this.incidentForm = this.formBuilder.group({
        logNumber: [this.lustIncidentGet.logNumber],
        qTimeId: [this.lustIncidentGet.qtimeId],
        projectManager: [pm],
        facilityId: [{value: this.lustIncidentGet.facilityId, disabled: true}],
        siteName:  [this.lustIncidentGet.siteName, Validators.compose([Validators.required, Validators.maxLength(40)])],
        siteAddress:    [this.lustIncidentGet.siteAddress, Validators.compose([Validators.required, Validators.maxLength(40)])],
        siteCity:  [this.lustIncidentGet.siteCity, Validators.compose([Validators.required, Validators.maxLength(20)])],
        siteZipcode: [this.lustIncidentGet.siteZipcode, Validators.compose([Validators.required])],
        siteCounty:  [+this.lustIncidentGet.logNbrCounty, Validators.required],
        sitePhone:  ['', Validators.compose([Validators.maxLength(25)
          , Validators.pattern('^\\(?([0-9]{3})\\)?[ -.Ã¢â€”Â]?([0-9]{3})[-.Ã¢â€”Â]?([0-9]{4})$')])],
        noValidAddress: [this.lustIncidentGet.noValidAddress],
        releaseType:  [this.lustIncidentGet.releaseType, Validators.required],
        geoLocId: [this.lustIncidentGet.geolocId],
        siteType2Id: [this.lustIncidentGet.siteTypeId],
        fileStatusId: [this.lustIncidentGet.fileStatusId],
        closureType: [''],
        brownfieldCodeId: [this.lustIncidentGet.brownfieldCodeId],
        propertyTranPendingInd: [this.lustIncidentGet.propertyTranPendingInd],
        programTransferInd:     [this.lustIncidentGet.programTransferInd],
        hotAuditRejectInd:      [this.lustIncidentGet.hotAuditRejectInd],
        activeReleaseInd:       [this.lustIncidentGet.activeReleaseInd],
        optionLetterSentInd:    [this.lustIncidentGet.optionLetterSentInd],
        dateReceived:  [this.lustIncidentGet.receivedDate, Validators.required],
        discoveryDate: [this.lustIncidentGet.discoveryDate, Validators.required],
        cleanupStartDate:  [this.lustIncidentGet.cleanupStartDate],
        finalInvcRqstDate: [this.lustIncidentGet.finalInvcRqstDate],
        releaseStopDate:  [this.lustIncidentGet.releaseStopDate],
        closedDate: [this.lustIncidentGet.closedDate],
        letterOfAgreementDate: [this.lustIncidentGet.letterOfAgreementDate],
        letterOfAgreementComment: [this.lustIncidentGet.letterOfAgreementComment],
        createDate: [this.lustIncidentGet.createDate],
        siteComment: [this.lustIncidentGet.siteComment],
        seeAlsoComment: [this.lustIncidentGet.seeAlsoComment],
        publicSummaryComment: [this.lustIncidentGet.publicSummaryComment],
        saAddressCorrectAddress: [{value: '', disabled: true}],
        saAddressCorrectCounty:  [{value: '', disabled: true}],
        saAddressCorrectCity:    [{value: '', disabled: true}],
        saAddressCorrectZipcode: [{value: '', disabled: true}],
        saAddressCorrectState:   [{value: '', disabled: true}],
        latDegrees: [this.lustIncidentGet.latDegrees],
        latMinutes: [this.lustIncidentGet.latMinutes],
        authUser: ['']
      },
      {validator: [this.siteNoAddressMissingValidation.bind(this), this.siteAddressNoAddressValidation.bind(this)] }
    );
  }

  transformDate(inDate: Date): string {
    return this.datePipe.transform(inDate, 'MM/dd/yyyy');
  }

  resetDate(): void {
    this.incidentForm.patchValue({
      dateReceived: this.datePipe.transform(new Date(), 'MM/dd/yyyy')
    });
  }

  runSaAddressCorrect() {
    if (this.incidentForm.controls.siteAddress !== undefined
      && this.incidentForm.controls.siteAddress.value.length > 0 ) {
        this.showSaAddressCorrect = true;
    }
    this.addressCorrectDataService.getAddressCorrectStat(this.incidentForm.controls.siteAddress.value
      , this.incidentForm.controls.siteCity.value, 'OR')
      .pipe(
        map(addressCorrectData => {
          this.saAddressCorrectStat = addressCorrectData;
          this.countyFips = addressCorrectData.Records[0].CountyFIPS.substring(2);
        }),
        flatMap(() => this.lustDataService.getPostalCountyLookup(+this.countyFips)
        ),
    )
    .subscribe(
      (data => {
        this.refreshSaAddressCorrect(data);
      } )
    );
  }

  private refreshSaAddressCorrect(postalCountyLookup: PostalCountyLookup) {
    this.postalCountyLookup = postalCountyLookup;
    this.incidentForm.controls.saAddressCorrectAddress.setValue(this.saAddressCorrectStat.Records[0].AddressLine1);
    this.incidentForm.controls.saAddressCorrectCity.setValue(this.saAddressCorrectStat.Records[0].City);
    this.incidentForm.controls.saAddressCorrectState.setValue(this.saAddressCorrectStat.Records[0].State);
    this.incidentForm.controls.saAddressCorrectCounty.setValue(this.postalCountyLookup.countyCode);
  }

  private addressCorrectNotFound(addressType: string): boolean {
    if ((addressType === 'sa')
    && (this.saAddressCorrectStat !== undefined)
    && (this.saAddressCorrectStat.Records[0].PostalCode.length < 5)) {
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

  private isActionSelected(): boolean {
    if  (this.submitClicked) {
      return true;
    }
    if  (this.resetFormClicked) {
      return true;
    }
    if  (this.searchClicked) {
      return true;
    }
    return false;
  }


  submitIncident(): void {
    this.submitClicked = true;
    if (this.incidentForm.dirty && this.incidentForm.valid) {
        this.updateIncident();
    } else if (this.incidentForm.invalid) {
        this.errors = this.findInvalidControls();
        console.log('this.errors');
        console.log(this.errors);
    }
  }

  updateIncident(): void {
    this.lustIncidentUpdate = Object.assign({},  this.incidentForm.value);
    this.buildUpdateRecord();
    this.lustDataService.updateLustIncident(this.lustIncidentUpdate)
      .subscribe(
          (data ) => (this.lustIncidentUpdateResult = data
                      , this.showSubmitStatusDialog()),
      );
      this.OnScrollIntoView();
  }

  onCreateLustIncidentComplete(): void {
    this.showSubmitStatusDialog();
  }

  private showSubmitStatusDialog() {
    let message1 = '';
    let title = '';
    const button1 = 'Close';
    if (this.lustIncidentUpdateResult.errorMessageHandler !== undefined &&
      this.lustIncidentUpdateResult.errorMessageHandler !== null &&
      this.lustIncidentUpdateResult.errorMessageHandler.length > 0 ) {
      title = 'Failed to update ' + this.lustIncidentGet.logNumber ;
      message1 = this.lustIncidentUpdateResult.errorMessageHandler;
    } else {
      title = 'Successfully updated ' + this.lustIncidentGet.logNumber;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: title,
      message1: message1,
      button1: button1,
    };
    dialogConfig.disableClose =  true;
    this.submitStatusDialogRef = this.submitStatusDialog.open(SubmitStatusDialogComponent, dialogConfig);
    this.submitStatusDialogRef.afterClosed().subscribe(() => {
      this.resetFlags();
      this.incidentForm.markAsPristine();
    });
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

    return invalid;
  }

  private buildUpdateRecord() {

    this.lustIncidentUpdate.activeReleaseInd = (this.incidentForm.controls.activeReleaseInd.value ? 1 : 0);
    this.lustIncidentUpdate.hotAuditRejectInd = (this.incidentForm.controls.hotAuditRejectInd.value ? 1 : 0);
    this.lustIncidentUpdate.programTransferInd = (this.incidentForm.controls.programTransferInd.value ? 1 : 0);
    this.lustIncidentUpdate.propertyTranPendingInd = (this.incidentForm.controls.propertyTranPendingInd.value ? 1 : 0);
    this.lustIncidentUpdate.optionLetterSentInd = (this.incidentForm.controls.optionLetterSentInd.value ? 1 : 0);
    this.lustIncidentUpdate.noValidAddress = (this.incidentForm.controls.noValidAddress.value ? 1 : 0);
    this.lustIncidentUpdate.lustIdIn = this.lustIncidentGet.crisCheck;
    this.lustIncidentUpdate.managementIdIn = this.lustIncidentGet.managementId;
    this.lustIncidentUpdate.hotInd = 0;
    this.lustIncidentUpdate.regTankInd = 0;
    this.lustIncidentUpdate.nonRegTankInd = 0;
    if (this.incidentForm.controls.releaseType.value === 'H')  {
      this.lustIncidentUpdate.hotInd = 1;
    } else if (this.incidentForm.controls.releaseType.value === 'U')  {
        this.lustIncidentUpdate.nonRegTankInd = 1;
    } else {
      this.lustIncidentUpdate.regTankInd = 1;
    }
    this.lustIncidentUpdate.siteComment = this.incidentForm.controls.siteComment.value;
    this.lustIncidentUpdate.seeAlsoComment = this.incidentForm.controls.seeAlsoComment.value;
    this.lustIncidentUpdate.publicSummaryComment = this.incidentForm.controls.publicSummaryComment.value;
    this.lustIncidentUpdate.olprrId = this.lustIncidentGet.olprrId;
    this.lustIncidentUpdate.dateReceived = this.incidentForm.controls.dateReceived.value;
    this.lustIncidentUpdate.discoveryDate = this.incidentForm.controls.discoveryDate.value;
    this.lustIncidentUpdate.siteTypeId = this.incidentForm.controls.siteType2Id.value;
    this.lustIncidentUpdate.fileStatusId = this.incidentForm.controls.fileStatusId.value;
    this.lustIncidentUpdate.brownfieldCodeId = this.incidentForm.controls.brownfieldCodeId.value;
    this.lustIncidentUpdate.geolocId = this.incidentForm.controls.geoLocId.value;
    this.lustIncidentUpdate.cleanupStartDt = this.incidentForm.controls.cleanupStartDate.value;
    this.lustIncidentUpdate.releaseStopDt = this.incidentForm.controls.releaseStopDate.value;
    this.lustIncidentUpdate.finalInvcRqstDt = this.incidentForm.controls.finalInvcRqstDate.value;
    this.lustIncidentUpdate.letterOfAgreementDt = this.incidentForm.controls.letterOfAgreementDate.value;
    this.lustIncidentUpdate.letterOfAgreementComment = this.incidentForm.controls.letterOfAgreementComment.value;
    console.log('*********this.lustIncident ' );
    console.log(this.lustIncidentUpdate);
    console.log( JSON.stringify(this.lustIncidentUpdate));

  }


  getAuthUserErrorMessage(): string {
    return 'Auth User required for opening LIT.....';
  }

  resetFlags() {
    this.submitClicked = false;
    this.resetFormClicked = false;
    this.searchClicked = false;
  }

  resetForm(): void {
    this.resetFlags();
    this.resetDate();
    this.resetFormClicked = true;
    this.incidentForm.reset();
    this.incidentForm.markAsUntouched();

    this.loadingSubject.next(true);
    this.route.data.subscribe((data: {lustIncidentGet: LustIncidentGet}) => {this.lustIncidentGet = data.lustIncidentGet; });
    this.createForm();
    this.maxDate = new Date();
    this.maxDate.setDate( this.maxDate.getDate());
    this.loadingSubject.next(false);
  }

  delete() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm Delete',
      message1: 'Are you sure you want to delete this incident ' + this.lustIncidentGet.logNumber + ' ?' ,
    };
    dialogConfig.disableClose =  true;
    this.confirmDeleteDialogRef = this.confirmDeleteDialog.open(ConfirmDeleteDialogComponent, dialogConfig);
    this.confirmDeleteDialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.lustDataService.delLustIncident(this.lustIncidentGet.lustId).subscribe();
        this.router.navigate(['lsearch']);
      }
    });
  }

  OnScrollIntoView () {
    // Attempt to bring the Search Results into view
    const scrToView = document.querySelector('#topOfForm');
    // console.log(scrToView);
    if (scrToView) {
      scrToView.scrollIntoView();
    }
  }

  siteAddressNoAddressValidation(control: AbstractControl) {
    // Validation - No Valid Address cannot be checked if siteAddress contains a value.  Other fields
    // such as SiteCity and SiteZipCode are required.
    let noValidAddressTemp = false;
    const noValidAddress = control.get('noValidAddress');
    const siteAddress = control.get('siteAddress');
    noValidAddressTemp = noValidAddress.value;
    if ((noValidAddressTemp === true) && siteAddress.value.length !== 0) {
      noValidAddress.setErrors({'noValidAddress': true});

      return {
        noValidAddressSiteAddressError: {
          noValidAddressSiteAddressError: true
        }
      };
    }  else {
      noValidAddress.setErrors(null);
      return null;
    }
  }

  receivedDateValidation(control: AbstractControl) {

    const receivedDatefd = control.get('dateReceived');
    const receivedDate = new Date(receivedDatefd.value);
    const closedDate = new Date(control.get('closedDate').value);
    const cleanupStartDate = new Date(control.get('cleanupStartDate').value);
    const releaseStopDate = new Date(control.get('releaseStopDate').value);
    const finalInvcRqstDate  = new Date(control.get('finalInvcRqstDate').value);
    const letterOfAgreementDate = new Date(control.get('letterOfAgreementDate').value);



    if (receivedDate > closedDate || receivedDate > cleanupStartDate || receivedDate > releaseStopDate
            || receivedDate > finalInvcRqstDate || receivedDate > letterOfAgreementDate ) {

        receivedDatefd.setErrors({'receivedDateAfterCloseDate': true});

      return {
        receivedDateAfterCloseDateError: {
          receivedDateAfterCloseDateError: true
            }
        };

      } else {
          receivedDatefd.setErrors(null);
          return null;
        }
    }

    siteNoAddressMissingValidation(control: AbstractControl) {

      const noValidAddressMissingfd = control.get('noValidAddress');
      const noValidAddressMissing = control.get('noValidAddress').value;
      const siteAddressMissingfd = control.get('siteAddress');
      // const siteAddressMissing = control.get('siteAddress').value;
      const siteCityMissingfd = control.get('siteCity');
      const siteCountyMissingfd = control.get('siteCounty');
      const siteZipcodeMissingfd = control.get('siteZipcode');
      // console.log(noValidAddressMissingfd.value);
      // console.log(noValidAddressMissing.value);

      if ((noValidAddressMissingfd.value === 0 || noValidAddressMissing.value === 0 || noValidAddressMissingfd.value === false)) {
        console.log('noValidAddress NOT checked');
        siteAddressMissingfd.setValidators([Validators.required, Validators.maxLength(40)]);
        siteCityMissingfd.setValidators([Validators.required, Validators.maxLength(20)]);
        siteCountyMissingfd.setValidators([Validators.required]);
        siteZipcodeMissingfd.setValidators([Validators.required]);

        siteAddressMissingfd.updateValueAndValidity({emitEvent: false, onlySelf: true});
        siteCityMissingfd.updateValueAndValidity({emitEvent: false, onlySelf: true});
        siteCountyMissingfd.updateValueAndValidity({emitEvent: false, onlySelf: true});
        siteZipcodeMissingfd.updateValueAndValidity({emitEvent: false, onlySelf: true});



      } else {
        console.log('noValidAddress checked');
        siteAddressMissingfd.clearValidators();
        siteCityMissingfd.clearValidators();
        siteCountyMissingfd.clearValidators();
        siteZipcodeMissingfd.clearValidators();


      }
    }

    public displayLatDms(): string {
      return 'Deg, Min, Sec:' + this.lustIncidentGet.latDegrees + 'º ' + this.lustIncidentGet.latMinutes + '\' '
      + this.lustIncidentGet.latSeconds + '\'\'';
    }

    public displayLogDms(): string {
      const degrees = this.lustIncidentGet.longDegrees.toString().replace('-', '');
      return 'Deg, Min, Sec:' +  degrees + 'º ' + this.lustIncidentGet.longMinutes
            + '\' ' + this.lustIncidentGet.longSeconds + '\'\'';
    }

    public displayLatDec(): string {
      return 'Decimal:' + this.lustIncidentGet.latDecimals.toString() + ' ' +
      this.getCoordLat(this.lustIncidentGet.latDecimals.toString());
    }

    public displayLogDec(): string {
      return 'Decimal:' + this.lustIncidentGet.longDecimals.toString() + ' ' +
        this.getCoordLOG(this.lustIncidentGet.longDecimals.toString());
    }


    getCoordLat(degrees: string): string {
      let rtn = ' N';
      if (degrees.includes('-', 1 )) {
          rtn = ' S';
      }
      return rtn;
    }

    getCoordLOG(degrees: string): string {
      let rtn = ' W';
      if (degrees.includes('-', 1 )) {
          rtn = ' E';
      }
      return rtn;
    }

    lustEntry(): void {

    }


    lustViewDocs(): void {

    }

}
