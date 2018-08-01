import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';
import { Observable, Subject, BehaviorSubject} from 'rxjs';
import { map, flatMap, mergeMap} from 'rxjs/operators';

import { LustDataService } from '../services/lust-data.service';
import { SiteType } from '../models/site-type';
import { ConfirmationType } from '../models/confirmation-type';
import { County } from '../models/county';
import { DiscoveryType } from '../models/discovery-type';
import { Quadrant } from '../models/quadrant';
import { ReleaseCauseType } from '../models/release-cause-type';
import { SourceType } from '../models/source-type';
import { State } from '../models/state';
import { StreetType } from '../models/street-type';
import { ConfigService } from '../common/config.service';
import { IncidentIdToNameService } from './incident-id-to-name.service';
import { IncidentData } from '../models/incident-data';
import { AddressCorrectDataService } from '../services/address-correct-data.service';
import { AddressCorrectStat } from '../models/address-correct-stat';
import { PostalCountyVerification } from '../models/postal-county-verification';
import { AddressCorrect } from '../models/address-correct';
import { AcceptedDialogComponent } from './accepted-dialog.component';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { GuardDialogComponent } from '../common/dialogs/guard-dialog.component';
import { SearchDialogComponent } from './search-dialog.component';
import { PdfService } from '../common/pdf.service';
import { LustIncident } from '../models/lust-incident';
import { LustIncidentInsertResult } from '../models/lust-incident-insert-result';

@Component({
  selector: 'app-olprr-review',
  templateUrl: './olprr-review.component.html',
  styleUrls: ['./olprr-review.component.scss'],
})
export class OlprrReviewComponent implements OnInit, CanDeactivateGuard {

  guardDialogRef: MatDialogRef<GuardDialogComponent, any>;
  searchDialogRef: MatDialogRef<SearchDialogComponent, any>;
  acceptedDialogRef: MatDialogRef<AcceptedDialogComponent, any>;
  olprrId: number;
  incidentData: IncidentData|null;
  incidentForm: FormGroup;
  confirmationTypes: ConfirmationType[] = [];
  counties: County[] = [];
  discoveryTypes: DiscoveryType[] = [];
  quadrants: Quadrant[] = [];
  releaseCauseTypes: ReleaseCauseType[] = [];
  siteTypes: SiteType[] = [];
  sourceTypes: SourceType[] = [];
  states: State[] = [];
  streetTypes: StreetType[] = [];
  addressCorrectStat: AddressCorrectStat;
  addressCorrects: AddressCorrect[];
  addressCorrect: AddressCorrect;
  addressCorrectStatLoaded = false;
  postalCountyVerification: PostalCountyVerification|null;
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
  acceptClicked = false;
  holdClicked = false;
  declineClicked = false;
  searchClicked = false;
  isClosed = true;
  isContaminantClosed = true;
  isMediaClosed = true;
  showAllErrorsMessages = false;
  showContaminantErrorMessage = false;
  showMediaErrorMessage = false;
  contaminantErrorMessage: string;
  mediaErrorMessage: string;
  contaminantErrorMessages: [string];
  mediaErrorMessages: [string];

  errors: any[];
  authRequired = false;
  showStatusButtons = false;
  actionStatusArray: Array<string> = ['NEW', 'HOLD'];
  showSaAddressCorrect = false;
  showRpAddressCorrect = false;
  showIcAddressCorrect = false;

  lustIncident = new LustIncident();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private lastSaRefresh: string;
  private lastRpRefresh: string;
  private lastIcRefresh: string;
  private lustIncidentInsertResult: LustIncidentInsertResult;





  constructor(private lustDataService: LustDataService, private formBuilder: FormBuilder, private datePipe: DatePipe
    , private idToNameService: IncidentIdToNameService, private route: ActivatedRoute
    , private router: Router, private addressCorrectDataService: AddressCorrectDataService
    , private canDeactivateDialog: MatDialog, private searchDialog: MatDialog
    , private acceptedDialog: MatDialog, private pdfService: PdfService
  ) {}

  ngOnInit() {
    this.olprrId = +this.route.snapshot.params['olprrid'];
    this.loadingSubject.next(true);
    this.route.data.subscribe((data: {incidentData: IncidentData}) => {this.incidentData = data.incidentData; } );
    this.route.data.subscribe((data: {siteTypes: SiteType[]}) => {this.siteTypes = data.siteTypes; });
    this.route.data.subscribe((data: {confirmationTypes: ConfirmationType[]}) => {this.confirmationTypes = data.confirmationTypes; });
    this.route.data.subscribe((data: {counties: County[]}) => {this.counties = data.counties; });
    this.route.data.subscribe((data: {discoveryTypes: DiscoveryType[]}) => {this.discoveryTypes = data.discoveryTypes; });
    this.route.data.subscribe((data: {quadrants: Quadrant[]}) => {this.quadrants = data.quadrants; });
    this.route.data.subscribe((data: {releaseCauseTypes: ReleaseCauseType[]}) => {this.releaseCauseTypes = data.releaseCauseTypes; });
    this.route.data.subscribe((data: {sourceTypes: SourceType[]}) => {this.sourceTypes = data.sourceTypes; });
    this.route.data.subscribe((data: {states: State[]}) => {this.states = data.states; });
    this.route.data.subscribe((data: {streetTypes: StreetType[]}) => {this.streetTypes = data.streetTypes; });

    this.route.data
      .pipe(
        map((data: {incidentData: IncidentData}) => {
          this.incidentData = data.incidentData;
          console.log('ngOnInit....incidentData..');
          console.log(this.incidentData);
        }),
        mergeMap(() => this.addressCorrectDataService
        .getAddressCorrectStat(this.incidentData.siteAddress, this.incidentData.siteCity, 'OR')
          .pipe(map(addressCorrect => {
            this.saAddressCorrectStat = addressCorrect;
            this.countyFips = addressCorrect.Records[0].CountyFIPS.substring(2);
            if (this.countyFips == null) {
              this.countyFips = '000';
            }
          })) // pipe end
        ),  // flatmap end

        mergeMap(() => this.lustDataService
        .getPostalCountyVerification(+this.incidentData.siteCounty, this.countyFips)
          .pipe(map(countyCheckData => {
            this.postalCountyVerification = countyCheckData;
          })) // pipe end
        ), // flatmap end

        mergeMap(() => this.addressCorrectDataService
        .getAddressCorrectStat(this.incidentData.rpAddress, this.incidentData.rpCity, this.incidentData.rpState)
          .pipe(map(addressCorrect => {
            this.rpAddressCorrectStat = addressCorrect;
          })) // pipe end
        ),  // flatmap end

        mergeMap(() => this.addressCorrectDataService
        .getAddressCorrectStat(this.incidentData.icAddress, this.incidentData.icCity, this.incidentData.icState)
          .pipe(map(addressCorrect => {
            this.icAddressCorrectStat = addressCorrect;
            console.log(this.icAddressCorrectStat);
          })) // pipe end
        ),  // flatmap end

      )  // pipe end
      .subscribe(
        (() => {
        this.loadingSubject.next(false);
        this.setShowStatusButtons();
        this.setShowContactInvoice();
        this.createForm();
      } )
      );

  }

  private setShowStatusButtons()  {
    if (this.actionStatusArray.indexOf(this.incidentData.siteStatus) > -1) {
      this.showStatusButtons = true;
    } else {
      this.showStatusButtons = false;
    }
  }


  private createForm() {
    this.incidentForm = this.formBuilder.group({
      rpFirstName:      [this.incidentData.rpFirstName, Validators.required],
      rpLastName:       [this.incidentData.rpLastName, Validators.required],
      rpOrganization:   [this.incidentData.rpOrganization],
      rpAddress:        [this.incidentData.rpAddress, Validators.required],
      rpAddress2:       [this.incidentData.rpAddress2],
      rpCity:           [this.incidentData.rpCity, Validators.required],
      rpState:          [this.incidentData.rpState, Validators.required],
      rpZipcode:        [this.incidentData.rpZipcode, Validators.required],
      rpPhone:          [this.incidentData.rpPhone, Validators.required],
      rpEmail:          [this.incidentData.rpEmail, [Validators.email]],
      icFirstName:      [this.incidentData.icFirstName],
      icLastName:       [this.incidentData.icLastName],
      icOrganization:   [this.incidentData.icOrganization],
      icAddress:        [this.incidentData.icAddress],
      icAddress2:       [this.incidentData.icAddress2],
      icCity:           [this.incidentData.icCity],
      icState:          [this.incidentData.icState],
      icZipcode:        [this.incidentData.icZipcode],
      icPhone:          [this.incidentData.icPhone],
      icEmail:          [this.incidentData.icEmail],
      // reportedByEmail:  ['', [Validators.email]],
      // reportedByEmail:  ['', [Validators.required, Validators.email]],
      siteName:         [this.incidentData.siteName, Validators.required],
      siteCounty:       [+this.incidentData.siteCounty, Validators.required],
      countyCode:       [+this.incidentData.countyCode, Validators.required],
      siteAddress:      [this.incidentData.siteAddress],
      siteCity:         [this.incidentData.siteCity, Validators.required],
      siteZipcode:      [this.incidentData.siteZipcode, Validators.required],
      sitePhone:        [this.incidentData.sitePhone],

      olprrId:          [{value: this.incidentData.olprrId, disabled: true}],
      contractorEmail:  [{value: this.incidentData.contractorEmail, disabled: true}],
      reportedBy:       [{value: this.incidentData.reportedBy, disabled: true}],
      reportedByPhone:  [{value: this.incidentData.reportedByPhone, disabled: true}],
      releaseType:      [{value: this.incidentData.releaseTypeCode, disabled: true}],
      dateReceived:     [{value: this.transformDate(this.incidentData.dateReceived), disabled: true}],
      facilityId:       [{value: this.incidentData.facilityId, disabled: true}],
      company:          [{value: this.incidentData.contractorName, disabled: true}],
      initialComment:   [{value: this.incidentData.siteComment, disabled: true}],
      discoveryDate:    [{value: this.transformDate(this.incidentData.discoveryDate), disabled: true}],
      confirmationCode: [{value: this.incidentData.confirmationCode, disabled: true}],
      discoveryCode:    [{value: this.incidentData.discoveryCode, disabled: true}],
      causeCode:        [{value: this.incidentData.causeCode, disabled: true}],
      sourceId:         [{value: this.incidentData.sourceId, disabled: true}],
      groundWater:      [{value: this.incidentData.groundWater, disabled: true}],
      surfaceWater:     [{value: this.incidentData.surfaceWater, disabled: true}],
      drinkingWater:    [{value: this.incidentData.drinkingWater, disabled: true}],
      soil:             [{value: this.incidentData.soil, disabled: true}],
      vapor:            [{value: this.incidentData.vapor, disabled: true}],
      freeProduct:      [{value: this.incidentData.freeProduct, disabled: true}],
      unleadedGas:      [{value: this.incidentData.unleadedGas, disabled: true}],
      leadedGas:        [{value: this.incidentData.leadedGas, disabled: true}],
      misGas:           [{value: this.incidentData.misGas, disabled: true}],
      diesel:           [{value: this.incidentData.diesel, disabled: true}],
      wasteOil:         [{value: this.incidentData.wasteOil, disabled: true}],
      heatingOil:       [{value: this.incidentData.heatingOil, disabled: true}],
      lubricant:        [{value: this.incidentData.lubricant, disabled: true}],
      solvent:          [{value: this.incidentData.solvent, disabled: true}],
      otherPet:         [{value: this.incidentData.otherPet, disabled: true}],
      chemical:         [{value: this.incidentData.chemical, disabled: true}],
      unknown:          [{value: this.incidentData.unknown, disabled: true}],
      mtbe:             [{value: this.incidentData.mtbe, disabled: true}],
      saAddressCorrectAddress: [{value: this.saAddressCorrectStat.Records[0].AddressLine1, disabled: true}],
      saAddressCorrectCounty:  [{value: this.postalCountyVerification.countyName, disabled: true}],
      saAddressCorrectCity:    [{value: this.saAddressCorrectStat.Records[0].City, disabled: true}],
      saAddressCorrectZipcode: [{value: this.saAddressCorrectStat.Records[0].PostalCode, disabled: true}],
      saAddressCorrectState:   [{value: this.saAddressCorrectStat.Records[0].State, disabled: true}],
      rpAddressCorrectAddress: [{value: this.rpAddressCorrectStat.Records[0].AddressLine1, disabled: true}],
      rpAddressCorrectCity:    [{value: this.rpAddressCorrectStat.Records[0].City, disabled: true}],
      rpAddressCorrectZipcode: [{value: this.rpAddressCorrectStat.Records[0].PostalCode, disabled: true}],
      rpAddressCorrectState:   [{value: this.rpAddressCorrectStat.Records[0].State, disabled: true}],
      icAddressCorrectAddress: [{value: this.icAddressCorrectStat.Records[0].AddressLine1, disabled: true}],
      icAddressCorrectCity:    [{value: this.icAddressCorrectStat.Records[0].City, disabled: true}],
      icAddressCorrectZipcode: [{value: this.icAddressCorrectStat.Records[0].PostalCode, disabled: true}],
      icAddressCorrectState:   [{value: this.icAddressCorrectStat.Records[0].State, disabled: true}],
      updateSaWithAddressCorrect: [0],
      updateRpWithAddressCorrect: [0],
      updateIcWithAddressCorrect: [0],
      authUser: ['']
    });

    if (this.showStatusButtons) {
      if (this.incidentData.releaseTypeCode !== 'H') {
        this.incidentForm.controls.facilityId.enable();
        this.incidentForm.controls.icAddress.setValidators([Validators.required]);
        // this.incidentForm.controls.icAddress2.setValidators([Validators.required]);
        this.incidentForm.controls.icFirstName.setValidators([Validators.required]);
        this.incidentForm.controls.icLastName.setValidators([Validators.required]);
        this.incidentForm.controls.icOrganization.setValidators([Validators.required]);
        this.incidentForm.controls.icCity.setValidators([Validators.required]);
        this.incidentForm.controls.icState.setValidators([Validators.required]);
        this.incidentForm.controls.icZipcode.setValidators([Validators.required]);
        this.incidentForm.controls.icPhone.setValidators([Validators.required]);
        // this.incidentForm.controls.icEmail.setValidators([Validators.required]);
      }
    } else {
      this.incidentForm.controls.icAddress.disable();
      this.incidentForm.controls.icAddress2.disable();
      this.incidentForm.controls.icFirstName.disable();
      this.incidentForm.controls.icLastName.disable();
      this.incidentForm.controls.icOrganization.disable();
      this.incidentForm.controls.icCity.disable();
      this.incidentForm.controls.icState.disable();
      this.incidentForm.controls.icZipcode.disable();
      this.incidentForm.controls.icPhone.disable();
      this.incidentForm.controls.icEmail.disable();

      this.incidentForm.controls.rpAddress.disable();
      this.incidentForm.controls.rpAddress2.disable();
      this.incidentForm.controls.rpFirstName.disable();
      this.incidentForm.controls.rpLastName.disable();
      this.incidentForm.controls.rpOrganization.disable();
      this.incidentForm.controls.rpCity.disable();
      this.incidentForm.controls.rpState.disable();
      this.incidentForm.controls.rpZipcode.disable();
      this.incidentForm.controls.rpPhone.disable();
      this.incidentForm.controls.rpEmail.disable();

      // this.incidentForm.controls.reportedByEmail.disable();
      this.incidentForm.controls.siteName.disable();
      this.incidentForm.controls.siteCounty.disable();
      this.incidentForm.controls.countyCode.disable();
      this.incidentForm.controls.siteAddress.disable();
      this.incidentForm.controls.siteCity.disable();
      this.incidentForm.controls.siteZipcode.disable();
      this.incidentForm.controls.sitePhone.disable();
    }
  }

  private addressCorrectNotFound(addressType: string): boolean {
    if ((addressType === 'sa')
    && (this.saAddressCorrectStat.Records[0].PostalCode.length < 5)) {
      return true;
    }
    if ((addressType === 'rp')
    && (this.rpAddressCorrectStat.Records[0].PostalCode.length < 5)) {
      return true;
    }
    if ((addressType === 'ic')
    && (this.icAddressCorrectStat.Records[0].PostalCode.length < 5)) {
      return true;
    }
    return false;
  }

  private setShowContactInvoice() {
    if (typeof this.incidentData.releaseTypeCode !== 'undefined'
    && (this.incidentData.releaseTypeCode === 'R' || this.incidentData.releaseTypeCode === 'U')) {
      this.showInvoiceContact = true;
    } else {
      this.showInvoiceContact = false;
    }
  }

  hold(): void {
    console.log('*************hold()');
    this.holdClicked = true;
    this.submitLustIncident();
  }

  decline(): void {
    console.log('decline()');
    this.declineClicked = true;
    this.submitLustIncident();
  }

  accept(): void {
    console.log('accept()');
    this.acceptClicked = true;
    // if (this.incidentForm.dirty && this.incidentForm.valid) {
    if (this.incidentForm.valid) {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!ok-valid form');
        this.submitLustIncident();
    } else if (this.incidentForm.invalid) {
        console.log('not ok-invalid form');
        this.errors = this.findInvalidControls();
        console.log(this.errors);
        this.showAllErrorsMessages = true;
        this.isClosed = false;
        console.log('ok why the errors not showing?????');
    }
  }

  private getNewSiteStatus(): string {
    if (this.acceptClicked) {
      return 'Accept';
    }
    if (this.holdClicked) {
      return 'Hold';
    }
    if (this.declineClicked) {
      return 'Decline';
    }
    return '';
  }
  private getNewSiteStatusVerbiage(): string {
    if (this.acceptClicked) {
      return 'Accepted';
    }
    if (this.holdClicked) {
      return 'Held';
    }
    if (this.declineClicked) {
      return 'Declined';
    }
    return '';
  }

  private isActionSelected(): boolean {
    if  (this.acceptClicked) {
      return true;
    }
    if  (this.holdClicked) {
      return true;
    }
    if  (this.declineClicked) {
      return true;
    }
    if  (this.searchClicked) {
      return true;
    }
    return false;
  }

  private buildLustIncident() {

    if (this.acceptClicked && this.incidentForm.controls.updateSaWithAddressCorrect.value) {
      this.lustIncident.siteAddress = this.saAddressCorrectStat.Records[0].AddressLine1;
      this.lustIncident.siteCity = this.saAddressCorrectStat.Records[0].City;
      this.lustIncident.siteZipcode = this.saAddressCorrectStat.Records[0].PostalCode;
      this.lustIncident.countyId = +this.postalCountyVerification.countyCode;
    } else {
      this.lustIncident.siteAddress = this.incidentData.siteAddress;
      this.lustIncident.siteCity = this.incidentData.siteCity;
      this.lustIncident.siteZipcode = this.incidentData.siteZipcode.toString();
      this.lustIncident.countyId = +this.incidentData.countyCode;
    }
    if (this.acceptClicked && this.incidentForm.controls.updateRpWithAddressCorrect.value) {
      this.lustIncident.rpAddress = this.rpAddressCorrectStat.Records[0].AddressLine1;
      this.lustIncident.rpCity = this.rpAddressCorrectStat.Records[0].City;
      this.lustIncident.rpZipcode = this.rpAddressCorrectStat.Records[0].PostalCode;
      this.lustIncident.rpState = this.rpAddressCorrectStat.Records[0].State;
    } else {
      this.lustIncident.rpAddress = this.incidentData.rpAddress;
      this.lustIncident.rpCity = this.incidentData.rpCity;
      this.lustIncident.rpZipcode = this.incidentData.rpZipcode;
      this.lustIncident.rpState = this.incidentData.rpState;
    }
    if (this.acceptClicked && this.showInvoiceContact && this.incidentForm.controls.updateIcWithAddressCorrect.value) {
      this.lustIncident.icAddress = this.icAddressCorrectStat.Records[0].AddressLine1;
      this.lustIncident.icCity = this.icAddressCorrectStat.Records[0].City;
      this.lustIncident.icZipcode = this.icAddressCorrectStat.Records[0].PostalCode;
      this.lustIncident.icState = this.rpAddressCorrectStat.Records[0].State;
    } else {
      this.lustIncident.icAddress = this.incidentData.icAddress;
      this.lustIncident.icCity = this.incidentData.icCity;
      this.lustIncident.icZipcode = this.incidentData.icZipcode;
      this.lustIncident.icState = this.incidentData.icState;
    }

    // this.lustIncident.icCountry = 'USA';
    // this.lustIncident.rpCountry = 'USA';
    // this.lustIncident.rpAffilComments = '';
    // this.lustIncident.icAffilComments = '';
    this.lustIncident.lustIdIn = 0;

    if (typeof this.incidentForm.controls.facilityId.value !== 'undefined'
    && this.incidentForm.controls.facilityId.value
    && this.incidentForm.controls.facilityId.value.length > 0
    && this.acceptClicked) {
      this.lustIncident.facilityId = +this.incidentForm.controls.facilityId.value;
    } else {
      this.lustIncident.facilityId = +this.incidentData.facilityId;
    }

    if (this.acceptClicked) {
      this.lustIncident.siteName = this.incidentForm.controls.siteName.value;
      this.lustIncident.sitePhone = this.incidentForm.controls.sitePhone.value;
    } else {
      this.lustIncident.siteName = this.incidentData.siteName;
      this.lustIncident.sitePhone = this.incidentData.sitePhone;
    }

    this.lustIncident.noValidAddress = 0;

    this.lustIncident.hotInd = 0;
    this.lustIncident.regTankInd = 0;
    this.lustIncident.nonRegTankInd = 0;
    if (this.incidentData.releaseTypeCode === 'H')  {
      this.lustIncident.hotInd = 1;
    } else if (this.incidentData.releaseTypeCode === 'U')  {
        this.lustIncident.nonRegTankInd = 1;
    } else {
      this.lustIncident.regTankInd = 1;
    }

    if (this.incidentData.siteComment === undefined) {
      this.lustIncident.initialComment = '';
    } else {
      this.lustIncident.initialComment = this.incidentData.siteComment;
    }
    this.lustIncident.olprrId = this.incidentForm.controls.olprrId.value;
    this.lustIncident.dateReceived = this.incidentData.dateReceived;
    this.lustIncident.discoveryDate = this.incidentData.discoveryDate;
    this.lustIncident.confirmationCode = this.incidentData.confirmationCode;
    this.lustIncident.discoveryCode = this.incidentData.discoveryCode;
    this.lustIncident.causeCode = this.incidentData.causeCode;
    this.lustIncident.sourceId = +this.incidentData.sourceId;
    this.lustIncident.soil = this.incidentData.soil;
    this.lustIncident.groundWater = this.incidentData.groundWater;
    this.lustIncident.surfaceWater = this.incidentData.surfaceWater;
    this.lustIncident.drinkingWater = this.incidentData.drinkingWater;
    this.lustIncident.vapor = this.incidentData.vapor;
    this.lustIncident.freeProduct = this.incidentData.freeProduct;
    this.lustIncident.heatingOil = this.incidentData.heatingOil;
    this.lustIncident.unleadedGas = this.incidentData.unleadedGas;
    this.lustIncident.leadedGas = this.incidentData.leadedGas;
    this.lustIncident.misGas = this.incidentData.misGas;
    this.lustIncident.diesel = this.incidentData.diesel;
    this.lustIncident.wasteOil = this.incidentData.wasteOil;
    this.lustIncident.lubricant = this.incidentData.lubricant;
    this.lustIncident.solvent = this.incidentData.solvent;
    this.lustIncident.otherPet = this.incidentData.otherPet;
    this.lustIncident.chemical = this.incidentData.chemical;
    this.lustIncident.mtbe = this.incidentData.mtbe;
    this.lustIncident.unknown = this.incidentData.unknown;
    this.lustIncident.appId = 'LUST' + (this.incidentForm.controls.authUser.value);
    this.lustIncident.newSiteStatus = this.getNewSiteStatus();
    this.lustIncident.rpOrganization = this.incidentForm.controls.rpOrganization.value;
    this.lustIncident.rpFirstName = this.incidentForm.controls.rpFirstName.value;
    this.lustIncident.rpLastName = this.incidentForm.controls.rpLastName.value;
    this.lustIncident.rpPhone = this.incidentForm.controls.rpPhone.value;
    this.lustIncident.rpEmail = this.incidentForm.controls.rpEmail.value;
    this.lustIncident.icOrganization = this.incidentForm.controls.icOrganization.value;
    this.lustIncident.icFirstName = this.incidentForm.controls.icFirstName.value;
    this.lustIncident.icLastName = this.incidentForm.controls.icLastName.value;
    this.lustIncident.icPhone = this.incidentForm.controls.icPhone.value;
    this.lustIncident.icEmail = this.incidentForm.controls.icEmail.value;

    console.log('*********this.lustIncident ' );
    console.log(this.lustIncident);
    console.log( JSON.stringify(this.lustIncident));
  }

  submitLustIncident(): void {
    this.buildLustIncident();
    this.lustDataService.createLustIncident(this.lustIncident)
      .subscribe(
          (data ) => (this.lustIncidentInsertResult = data
                      , this.onCreateLustIncidentComplete()),
          // (error: any) => {this.errorMessage = <any>error;
          //   console.log('*****submitLustIncident() error message');
          //   console.log(error);
          // }
      );
  }

  onCreateLustIncidentComplete(): void {
    console.log('ok did it hip hip hoorayyy!!!!');
    console.log('******************this.lustIncidentInsertResult');
    console.log(this.lustIncidentInsertResult);

    if (this.acceptClicked === true) {
      this.pdfGenerate();
      this.print();
    }

    this.showMovingOnDialog();
  }

  private showMovingOnDialog() {
    let message1 = '';
    let title = '';
    let showLustButton = false;
    if (this.lustIncidentInsertResult.errorMessage.length > 0 ) {
      title = 'Failed to update OlprrId ' + this.lustIncidentInsertResult.olprrId + ' to ' +  this.getNewSiteStatus() + ' status.';
      message1 = this.lustIncidentInsertResult.errorMessage;
    }
    if (this.lustIncidentInsertResult.errorMessage.length === 0 ) {
      title = 'Successfully updated OlprrId ' + this.lustIncidentInsertResult.olprrId + ' to '
      +  this.getNewSiteStatusVerbiage() + ' status.';
      if (this.acceptClicked) {
        message1  = 'LUST Log Number: ' + this.lustIncidentInsertResult.logNumberTemp;
        showLustButton = true;
      }
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: title,
      message1: message1,
      suppressLustButton: showLustButton,
    };
    dialogConfig.disableClose =  true;
    this.acceptedDialogRef = this.acceptedDialog.open(AcceptedDialogComponent, dialogConfig);
    this.acceptedDialogRef.afterClosed().subscribe(result => {
      this.movingOn(result);
    });
  }

  private movingOn(choice: string) {
    this.router.navigate([choice]);
  }

  resetFlags() {
    this.showAllErrorsMessages = false;
    this.acceptClicked = false;
    this.holdClicked = false;
    this.declineClicked = false;
  }

  resetDate(): void {
    // this.incidentForm.patchValue({
    //   dateReceived: this.datePipe.transform(new Date(), 'MM/dd/yyyy')
    // });
  }

  resetForm(): void {
    this.incidentForm.reset();
    this.resetFlags();
    this.resetDate();
  }

  transformDate(inDate: Date): string {
    return this.datePipe.transform(inDate, 'MM/dd/yyyy');
  }

  private findInvalidControls() {
    const invalid = [];
    for (const field of Object.keys(this.incidentForm.controls)) {
        if (this.incidentForm.controls[field].invalid) {
            console.log('******findInvalidControls()*******');
            console.log(field);
            const name = this.idToNameService.getName(field);
            invalid.push(name + ' is required and must be valid.');
        }
    }
    return invalid;
  }

  private openLit() {
    let address: string;
    let city: string;
    let zipcode: string;
    if (this.incidentForm.controls.updateSaWithAddressCorrect.value) {
      address = this.incidentForm.controls.saAddressCorrectAddress.value;
      city = this.incidentForm.controls.saAddressCorrectCity.value;
      zipcode = this.incidentForm.controls.saAddressCorrectZipcode.value;
    } else {
      address = this.incidentForm.controls.siteAddress.value;
      city = this.incidentForm.controls.siteCity.value;
      zipcode = this.incidentForm.controls.siteZipcode.value;
    }
    if (typeof this.incidentForm.controls.authUser.value !== 'undefined'
      && this.incidentForm.controls.authUser.value
      && this.incidentForm.controls.authUser.value.length > 0) {
      this.authRequired = false;
      const params = encodeURI('LUST' + this.incidentForm.controls.authUser.value + '&address='
                        + address + '&city=' + city +  '&zip='
                        + zipcode + '&facname=' + this.incidentForm.controls.siteName.value);
        const lit_url = environment.lit_site_setup + params;
        window.open(lit_url, '_blank');
    } else {
      this.authRequired = true;
    }
  }

  getAuthUserErrorMessage(): string {
    return 'Auth User required for opening LIT.....';
  }

  runSaAddressCorrect() {
    this.addressCorrectDataService.getAddressCorrectStat(this.incidentForm.controls.siteAddress.value
      , this.incidentForm.controls.siteCity.value, 'OR')
      .pipe(
        map(addressCorrectData => {
          this.saAddressCorrectStat = addressCorrectData,
          this.countyFips = addressCorrectData.Records[0].CountyFIPS.substring(2);
        }),
        flatMap(() => this.lustDataService.getPostalCountyVerification(+this.incidentForm.controls.countyCode.value, this.countyFips)
        ),
    )
    .subscribe(
      (data => {
        this.refreshSaAddressCorrect(data);
      } )
    );
  }

  private refreshSaAddressCorrect(postalCountyVerification: PostalCountyVerification) {
    this.postalCountyVerification = postalCountyVerification;
    this.incidentForm.controls.saAddressCorrectAddress.setValue(this.saAddressCorrectStat.Records[0].AddressLine1);
    this.incidentForm.controls.saAddressCorrectCity.setValue(this.saAddressCorrectStat.Records[0].City);
    this.incidentForm.controls.saAddressCorrectState.setValue(this.saAddressCorrectStat.Records[0].State);
    this.incidentForm.controls.saAddressCorrectCounty.setValue(this.postalCountyVerification.countyName);
    this.incidentForm.controls.updateSaWithAddressCorrect.setValue(false);
    this.lastSaRefresh = ' - Last Update [' + this.datePipe.transform(Date.now(), 'mediumTime') + ']';
  }

  runRpAddressCorrect() {
    this.addressCorrectDataService.getAddressCorrectStat(this.incidentForm.controls.rpAddress.value
      , this.incidentForm.controls.rpCity.value, this.incidentForm.controls.rpState.value)
      .pipe(
        map(addressCorrectData => {
          this.refreshRpAddressCorrect(addressCorrectData);
      }),
    )
    .subscribe();
  }

  private refreshRpAddressCorrect(addressCorrectData: AddressCorrectStat) {
    this.rpAddressCorrectStat = addressCorrectData;
    this.incidentForm.controls.rpAddressCorrectAddress.setValue(this.rpAddressCorrectStat.Records[0].AddressLine1);
    this.incidentForm.controls.rpAddressCorrectCity.setValue(this.rpAddressCorrectStat.Records[0].City);
    this.incidentForm.controls.rpAddressCorrectState.setValue(this.rpAddressCorrectStat.Records[0].State);
    this.incidentForm.controls.updateRpWithAddressCorrect.setValue(false);
    this.lastRpRefresh = ' - Last Update [' + this.datePipe.transform(Date.now(), 'mediumTime') + ']';
  }

  runIcAddressCorrect() {
    this.addressCorrectDataService.getAddressCorrectStat(this.incidentForm.controls.icAddress.value
      , this.incidentForm.controls.icCity.value, this.incidentForm.controls.icState.value)
      .pipe(
        map(addressCorrectData => {
          this.refreshIcAddressCorrect(addressCorrectData);
      }),
    )
    .subscribe();
  }

  private refreshIcAddressCorrect(addressCorrectData: AddressCorrectStat) {
    this.icAddressCorrectStat = addressCorrectData;
    this.incidentForm.controls.icAddressCorrectAddress.setValue(this.icAddressCorrectStat.Records[0].AddressLine1);
    this.incidentForm.controls.icAddressCorrectCity.setValue(this.icAddressCorrectStat.Records[0].City);
    this.incidentForm.controls.icAddressCorrectState.setValue(this.icAddressCorrectStat.Records[0].State);
    this.incidentForm.controls.updateIcWithAddressCorrect.setValue(false);
    this.lastIcRefresh = ' - Last Update [' + this.datePipe.transform(Date.now(), 'mediumTime') + ']';
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
      message1: 'The form has not been Accepted/Held/Declined yet, do you really want to leave page?',
      button1: 'Leave',
      button2: 'Stay'
    };
    this.guardDialogRef = this.canDeactivateDialog.open(GuardDialogComponent, dialogConfig);
    this.guardDialogRef.afterClosed().subscribe(result => {
      choice.next(result);
    });
    return choice;
  }

  private openUstSearch() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      searchType: 'UST'
    };
    this.searchDialogRef = this.searchDialog.open(SearchDialogComponent, dialogConfig);
  }

  private openLustSearch() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      searchType: 'LUST'
    };
    this.searchDialogRef = this.searchDialog.open(SearchDialogComponent, dialogConfig);
  }

  private cancel() {
    this.router.navigate(['osearch']);
  }

  private print(): void {
    window.print();
  }


  public pdfGenerate(): void {
    this.pdfService.createOlprrPdfIncident(this.lustIncident, this.lustIncidentInsertResult);
  }

}
