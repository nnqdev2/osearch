import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Observable, Subject, BehaviorSubject} from 'rxjs';
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
import { LustIncidentUpdate } from '../../models/lust-incident';
import { LustIncidentInsertResult } from '../../models/lust-incident-insert-result';
import { City } from '../../models/city';
import { ZipCode } from '../../models/zipcode';
import { County } from '../../models/county';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';
import { SelectedDataService } from '../services/selected-data.service';
import { ContactSearchResultStat } from '../../models/contact-search-result-stat';
import { UstSearchResultStat } from '../../models/ust-search-result-stat';
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
@Component({
  selector: 'app-lust-incident-edit',
  templateUrl: './lust-incident-edit.component.html',
  styleUrls: ['./lust-incident-edit.component.scss']
})
export class LustIncidentEditComponent implements OnInit  {
  guardDialogRef: MatDialogRef<GuardDialogComponent, any>;
  searchDialogRef: MatDialogRef<SearchDialogComponent, any>;
  submitStatusDialogRef: MatDialogRef<SubmitStatusDialogComponent, any>;

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
  private helpClicked = false;
  private searchClicked = false;
  private isClosed = true;
  private isContaminantClosed = true;
  private isMediaClosed = true;
  private showAllErrorsMessages = false;
  private showContaminantErrorMessage = false;
  private showMediaErrorMessage = false;
  private contaminantErrorMessage: string;
  private mediaErrorMessage: string;
  private contaminantErrorMessages: [string];
  private mediaErrorMessages: [string];

  private errors: any[];
  private authRequired = false;
  // showStatusButtons = false;
  private showSaAddressCorrect = false;
  // showRpAddressCorrect = false;
  // showIcAddressCorrect = false;

  private lustIncidentUpdate = new LustIncidentUpdateUpdate();
  private lustIncidentUpdateResult: LustIncidentUpdateResult;


  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  maxDate: Date;

  constructor(private lustDataService: LustDataService, private formBuilder: FormBuilder, private datePipe: DatePipe
    , private route: ActivatedRoute, private router: Router, private addressCorrectDataService: AddressCorrectDataService
    , private canDeactivateDialog: MatDialog, private searchDialog: MatDialog, private submitStatusDialog: MatDialog
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
  }


  createForm() {
    console.log('********************edit lust  createForm()');

    console.log(this.lustIncidentGet);
    let pm;
    if (this.projectManagers !== undefined) {
      pm = this.projectManagers.pop();
    }
    this.incidentForm = this.formBuilder.group({
        logNumber: [this.lustIncidentGet.logNumber],
        qTimeId: [this.lustIncidentGet.qtimeId],
        projectManager: [pm],
        facilityId: ['', Validators.pattern('^([+-]?[1-9]\\d*|0)$')],
        siteName:  [this.lustIncidentGet.siteName, Validators.compose([Validators.required, Validators.maxLength(40)])],
        siteAddress:    [this.lustIncidentGet.siteAddress, Validators.compose([Validators.required, Validators.maxLength(50)])],
        siteCity:  [this.lustIncidentGet.siteCity, Validators.compose([Validators.required, Validators.maxLength(25)])],
        siteZipcode: [this.lustIncidentGet.siteZipcode, Validators.compose([Validators.required, Validators.maxLength(10)
          , Validators.pattern('^(?!0{5})\\d{5}(?:[-\s]\\d{4})?')])],
        siteCounty:  [+this.lustIncidentGet.logNbrCounty],
        sitePhone:  ['', Validators.compose([Validators.maxLength(25)])],
        noValidAddress: [this.lustIncidentGet.noValidAddress],
        releaseType:  [this.lustIncidentGet.releaseType],
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
        dateReceived:  [this.lustIncidentGet.receivedDate],
        discoveryDate: [this.lustIncidentGet.discoveryDate],
        // dateReceived:  [{value: this.transformDate(this.lustIncidentGet.receivedDate)}],
        // discoveryDate: [{value: this.transformDate(this.lustIncidentGet.discoveryDate)}],
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
        authUser: ['']
      },
      {validator: [] }
    );
    // this.resetDate();
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
    // if  (this.esetFormClicked) {
    //   return true;
    // }
    // if  (this.helpClicked) {
    //   return true;
    // }
    // if  (this.searchClicked) {
    //   return true;
    // }
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
        // this.contaminantErrorMessage = this.getContaminantErrorMessage();
        // if (this.contaminantErrorMessage != null) {
        //   this.contaminantErrorMessages = [this.contaminantErrorMessage];
        //   this.errors.push(this.contaminantErrorMessage);
        //   this.showContaminantErrorMessage = true;
        // }
        // this.mediaErrorMessage = this.getMediaErrorMessage();
        // if (this.mediaErrorMessage != null) {
        //   this.mediaErrorMessages = [this.mediaErrorMessage];
        //   this.errors.push(this.mediaErrorMessage);
        //   this.showMediaErrorMessage = true;
        // }
        this.showAllErrorsMessages = true;
        this.isClosed = false;
        this.isContaminantClosed = false;
        this.isMediaClosed = false;
    }
  }

  updateIncident(): void {
    this.lustIncidentUpdate = Object.assign({},  this.incidentForm.value);
    console.log('updateIncident()');
    console.log(this.lustIncidentUpdate);
    this.buildUpdateRecord();
    this.lustDataService.updateLustIncident(this.lustIncidentUpdate)
      .subscribe(
          (data ) => (this.lustIncidentUpdateResult = data
                      , this.showSubmitStatusDialog()),
      );
  }

  onCreateLustIncidentComplete(): void {
    console.log('onCreateLustIncidentComplete() this.lustIncidentInsertResult');
    console.log(this.lustIncidentUpdateResult);
    this.showSubmitStatusDialog();
  }

  private showSubmitStatusDialog() {
    console.log('showSubmitStatusDialog() this.lustIncidentInsertResult');
    console.log(this.lustIncidentUpdateResult);
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
    this.submitStatusDialogRef.afterClosed().subscribe(result => {
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

  // private getMediaErrorMessage(): string {
  //   const test = this.incidentForm.controls.activeReleaseInd.value;
  //   if (this.incidentForm.controls.groundWater.value || this.incidentForm.controls.surfaceWater.value ||
  //     this.incidentForm.controls.drinkingWater.value || this.incidentForm.controls.soil.value ||
  //     this.incidentForm.controls.vapor.value || this.incidentForm.controls.freeProduct.value
  //   ) { return null; } else {
  //     this.showMediaErrorMessage = true;
  //     return('Must select at least one Media.');
  //   }
  // }
  // private getContaminantErrorMessage(): string {
  //   if (this.incidentForm.controls.heatingOil.value || this.incidentForm.controls.unleadedGas.value ||
  //     this.incidentForm.controls.leadedGas.value || this.incidentForm.controls.misGas.value ||
  //     this.incidentForm.controls.diesel.value || this.incidentForm.controls.wasteOil.value ||
  //     this.incidentForm.controls.lubricant.value || this.incidentForm.controls.solvent.value ||
  //     this.incidentForm.controls.otherPet.value || this.incidentForm.controls.chemical.value ||
  //     this.incidentForm.controls.unknown.value || this.incidentForm.controls.mtbe.value
  //   ) { return null; } else {
  //     this.showContaminantErrorMessage = true;
  //     return('Must select at least one Contaminant.');
  //   }
  // }

  private buildUpdateRecord() {

    this.lustIncidentUpdate.activeReleaseInd = (this.incidentForm.controls.activeReleaseInd.value ? 1 : 0);
    this.lustIncidentUpdate.hotAuditRejectInd = (this.incidentForm.controls.hotAuditRejectInd.value ? 1 : 0);
    this.lustIncidentUpdate.programTransferInd = (this.incidentForm.controls.programTransferInd.value ? 1 : 0);
    this.lustIncidentUpdate.propertyTranPendingInd = (this.incidentForm.controls.propertyTranPendingInd.value ? 1 : 0);
    this.lustIncidentUpdate.optionLetterSentInd = (this.incidentForm.controls.optionLetterSentInd.value ? 1 : 0);
    this.lustIncidentUpdate.noValidAddress = (this.incidentForm.controls.noValidAddress.value ? 1 : 0);
    this.lustIncidentUpdate.lustIdIn = this.lustIncidentGet.crisCheck;
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
    this.lustIncidentUpdate.geolocId = this.incidentForm.controls.geoLocId.value;
    console.log('*********this.lustIncident ' );
    console.log(this.lustIncidentUpdate);
    console.log( JSON.stringify(this.lustIncidentUpdate));

  }


  getAuthUserErrorMessage(): string {
    return 'Auth User required for opening LIT.....';
  }

  private cancel() {
    this.searchClicked = true;
    this.router.navigate(['lsearch']);
  }
  resetFlags() {
    this.showAllErrorsMessages = false;
    this.submitClicked = false;
    this.resetFormClicked = false;
    this.helpClicked = false;
    this.searchClicked = false;
  }

  resetForm(): void {
    this.resetFormClicked = true;
    this.incidentForm.reset();
    this.resetFlags();
    this.resetDate();
  }

}
