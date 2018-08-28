import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Observable, Subject, BehaviorSubject, Subscription} from 'rxjs';
import { map, flatMap, mergeMap} from 'rxjs/operators';

import { LustDataService } from '../../services/lust-data.service';
import { SiteType } from '../../models/site-type';
import { ConfirmationType } from '../../models/confirmation-type';
import { DiscoveryType } from '../../models/discovery-type';
import { ReleaseCauseType } from '../../models/release-cause-type';
import { SourceType } from '../../models/source-type';
import { State } from '../../models/state';
// import { IncidentIdToNameService } from '../../incident-id-to-name.service';
import { IncidentData } from '../../models/incident-data';
import { AddressCorrectDataService } from '../../services/address-correct-data.service';
import { AddressCorrectStat } from '../../models/address-correct-stat';
import { PostalCountyVerification } from '../../models/postal-county-verification';
import { AddressCorrect } from '../../models/address-correct';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CanDeactivateGuard } from '../../guards/can-deactivate-guard.service';
import { GuardDialogComponent } from '../../common/dialogs/guard-dialog.component';
import { LustIncident } from '../../models/lust-incident';
import { LustIncidentInsertResult } from '../../models/lust-incident-insert-result';
import { City } from '../../models/city';
import { ZipCode } from '../../models/zipcode';
import { County } from '../../models/county';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';
import { ContactSearchFilterComponent } from '../../contact-search/contact-search-filter.component';
import { SelectedDataService } from '../services/selected-data.service';
import { ContactSearchResultStat } from '../../models/contact-search-result-stat';
import { UstSearchResultStat } from '../../models/ust-search-result-stat';
import { IncidentIdToNameService } from '../../olprr-search/incident-id-to-name.service';

@Component({
  selector: 'app-lust-incident-create',
  templateUrl: './lust-incident-create.component.html',
  styleUrls: ['./lust-incident-create.component.scss']
})
export class LustIncidentCreateComponent implements OnInit  {
  guardDialogRef: MatDialogRef<GuardDialogComponent, any>;
  searchDialogRef: MatDialogRef<SearchDialogComponent, any>;

  olprrId: number;
  incidentData: IncidentData|null;
  incidentForm: FormGroup;
  confirmationTypes: ConfirmationType[] = [];
  discoveryTypes: DiscoveryType[] = [];
  releaseCauseTypes: ReleaseCauseType[] = [];
  siteTypes: SiteType[] = [];
  sourceTypes: SourceType[] = [];
  cities: City[] = [];
  states: State[] = [];
  zipcodes: ZipCode[] = [];
  counties: County[] = [];
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

  submitClicked = false;

  errors: any[];
  authRequired = false;
  showStatusButtons = false;
  showSaAddressCorrect = false;
  showRpAddressCorrect = false;
  showIcAddressCorrect = false;
  private showSaAddressCheck = false;

  lustIncident = new LustIncident();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private lastSaRefresh: string;
  private lastRpRefresh: string;
  private lastIcRefresh: string;
  private lustIncidentInsertResult: LustIncidentInsertResult;
  maxDate: Date;

  private selectedContact: ContactSearchResultStat;
  private selectedUst: UstSearchResultStat;


  constructor(private lustDataService: LustDataService, private formBuilder: FormBuilder, private datePipe: DatePipe
    , private route: ActivatedRoute, private router: Router, private addressCorrectDataService: AddressCorrectDataService
    , private canDeactivateDialog: MatDialog, private searchDialog: MatDialog, private selectedDataService: SelectedDataService
    , private idToNameService: IncidentIdToNameService
  ) {  }

  ngOnInit() {
    this.loadingSubject.next(true);
    this.route.data.subscribe((data: {siteTypes: SiteType[]}) => {this.siteTypes = data.siteTypes; });
    this.route.data.subscribe((data: {confirmationTypes: ConfirmationType[]}) => {this.confirmationTypes = data.confirmationTypes; });
    this.route.data.subscribe((data: {discoveryTypes: DiscoveryType[]}) => {this.discoveryTypes = data.discoveryTypes; });
    this.route.data.subscribe((data: {releaseCauseTypes: ReleaseCauseType[]}) => {this.releaseCauseTypes = data.releaseCauseTypes; });
    this.route.data.subscribe((data: {sourceTypes: SourceType[]}) => {this.sourceTypes = data.sourceTypes; });
    this.route.data.subscribe((data: {cities: City[]}) => {this.cities = data.cities;});
    this.route.data.subscribe((data: {states: State[]}) => {this.states = data.states; });
    this.route.data.subscribe((data: {zipCodes: ZipCode[]}) => {this.zipcodes = data.zipCodes;});
    this.route.data.subscribe((data: {counties: County[]}) => {this.counties = data.counties;});
    this.createForm();
    this.maxDate = new Date();
    this.maxDate.setDate( this.maxDate.getDate());
    this.loadingSubject.next(false);
  }


  createForm() {
    this.incidentForm = this.formBuilder.group({
        contractorUid:  [''],
        contractorPwd:  [''],
        reportedBy:  ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
        reportedByPhone:  ['', Validators.compose([Validators.required, Validators.maxLength(25)])],
        reportedByEmail: ['',  Validators.compose([Validators.required, Validators.email, Validators.maxLength(75)])],
        releaseType:  ['', Validators.required],
        dateReceived:  [{value: '', disabled: false},  Validators.required],
        discoveryDate: [{value: '', disabled: false}, Validators.compose([Validators.required])],
        noValidAddress: [{value: '', disabled: false}],
        facilityId: ['', Validators.pattern('^([+-]?[1-9]\\d*|0)$')],
        siteName:  [{value: '', disabled: false}, Validators.compose([Validators.required, Validators.maxLength(40)])],
        siteCounty:  ['', Validators.required],
        streetNbr: ['', Validators.compose([Validators.required, Validators.maxLength(11)])],
        siteAddress:    ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
        siteCity:  ['', Validators.compose([Validators.required, Validators.maxLength(25)])],
        siteZipcode: ['', Validators.compose([Validators.required, Validators.maxLength(10)
          , Validators.pattern('^(?!0{5})\\d{5}(?:[-\s]\\d{4})?')])],
        sitePhone:  ['', Validators.compose([Validators.maxLength(25)])],
        company:  ['', Validators.required],
        initialComment:  ['', Validators.maxLength(710)],

        confirmationCode:  ['', Validators.required],
        discoveryCode:  ['', Validators.required],
        causeCode: ['', Validators.required],
        sourceId:  ['', Validators.required],
        rpFirstName:  ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
        rpLastName: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
        rpOrganization:  ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
        rpAddress:  ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
        rpCity:  ['', Validators.compose([Validators.required, Validators.maxLength(25)])],
        rpState:  ['', Validators.compose([Validators.required, Validators.maxLength(2)])],
        rpZipcode: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
        rpPhone:  ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
        rpEmail:  ['', Validators.compose([Validators.email, Validators.maxLength(30)])],
        rpCountry:  ['', Validators.compose([Validators.maxLength(30)])],
        icFirstName:  ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
        icLastName: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
        icOrganization:  ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
        icAddress:  ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
        icCity:  ['', Validators.compose([Validators.required, Validators.maxLength(25)])],
        icState:  ['', Validators.compose([Validators.required, Validators.maxLength(2)])],
        icZipcode: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
        icPhone:  ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
        icEmail:  ['', Validators.compose([Validators.email, Validators.maxLength(30)])],
        icCountry:  ['', Validators.compose([Validators.maxLength(30)])],
        groundWater: [0],
        surfaceWater: [0],
        drinkingWater: [0],
        soil: [0],
        vapor: [0],
        freeProduct: [0],
        unleadedGas: [0],
        leadedGas: [0],
        misGas: [0],
        diesel: [0],
        wasteOil: [0],
        heatingOil: [0],
        lubricant: [0],
        solvent: [0],
        otherPet: [0],
        chemical: [0],
        unknown: [0],
        mtbe: [0],
        submitDateTime: [''],
        deqOffice: [''],
        saAddressCorrectAddress: [{value: '', disabled: true}],
        saAddressCorrectCounty:  [{value: '', disabled: true}],
        saAddressCorrectCity:    [{value: '', disabled: true}],
        saAddressCorrectZipcode: [{value: '', disabled: true}],
        saAddressCorrectState:   [{value: '', disabled: true}],
        rpAddressCorrectAddress: [{value: '', disabled: true}],
        rpAddressCorrectCity:    [{value: '', disabled: true}],
        rpAddressCorrectZipcode: [{value: '', disabled: true}],
        rpAddressCorrectState:   [{value: '', disabled: true}],
        icAddressCorrectAddress: [{value: '', disabled: true}],
        icAddressCorrectCity:    [{value: '', disabled: true}],
        icAddressCorrectZipcode: [{value: '', disabled: true}],
        icAddressCorrectState:   [{value: '', disabled: true}],
        updateSaWithAddressCorrect:   [{value: ''}],
        updateRpWithAddressCorrect:   [{value: ''}],
        updateIcWithAddressCorrect:   [{value: ''}],
        authUser: ['']
      },
      {validator: [] }
    );
    this.resetDate();
  }

  resetDate(): void {
    this.incidentForm.patchValue({
      dateReceived: this.datePipe.transform(new Date(), 'MM/dd/yyyy')
    });
  }


  private addressCorrectNotFound(addressType: string): boolean {
    if ((addressType === 'sa')
    && (this.saAddressCorrectStat !== undefined)
    && (this.saAddressCorrectStat.Records[0].PostalCode.length < 5)) {
      return true;
    }
    if ((addressType === 'rp')
    && (this.rpAddressCorrectStat !== undefined)
    && (this.rpAddressCorrectStat.Records[0].PostalCode.length < 5)) {
      return true;
    }
    if ((addressType === 'ic')
    && (this.icAddressCorrectStat !== undefined)
    && (this.icAddressCorrectStat.Records[0].PostalCode.length < 5)) {
      return true;
    }
    return false;
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
        flatMap(() => this.lustDataService.getPostalCountyVerification(+this.incidentForm.controls.siteCounty.value, this.countyFips)
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
    if (this.incidentForm.controls.rpAddress !== undefined
      && this.incidentForm.controls.rpAddress.value.length > 0 ) {
      this.showRpAddressCorrect = true;
    }
    this.addressCorrectDataService.getAddressCorrectStat(this.incidentForm.controls.rpAddress.value
      , this.incidentForm.controls.rpCity.value, this.incidentForm.controls.rpState.value)
      .pipe(
        map(addressCorrectData => {
          console.log('runRpAddressCorrect  this.rpAddressCorrectStat');
          this.rpAddressCorrectStat = addressCorrectData;
          console.log(this.rpAddressCorrectStat);
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
    if (this.incidentForm.controls.icAddress !== undefined
      && this.incidentForm.controls.icAddress.value.length > 0 ) {
      this.showIcAddressCorrect = true;
    }
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


  private openUstSearch() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      searchType: 'UST',
    };
    this.searchDialogRef = this.searchDialog.open(SearchDialogComponent, dialogConfig);
    this.searchDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.updateSiteAddress(result);
      }
    });
  }
  private openContactSearch(contactType: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    // dialogConfig.disableClose =  true;
    dialogConfig.data = {
      searchType: 'Contact',
    };
    this.searchDialogRef = this.searchDialog.open(SearchDialogComponent, dialogConfig);
    this.searchDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.updateContact(result, contactType);
      }
    });
  }

  private updateContact(contactSearchResultStat: ContactSearchResultStat, contactType: string) {
    console.log('updateContact(contactType: string, contactSearchResultStat: ContactSearchResultStat)');
    console.log(contactType);
    console.log(contactSearchResultStat);
    if (contactType === 'RP') {
      this.incidentForm.controls.rpAddress.setValue(contactSearchResultStat.street);
      this.incidentForm.controls.rpCity.setValue(contactSearchResultStat.city);
      this.incidentForm.controls.rpState.setValue(contactSearchResultStat.state);
      this.incidentForm.controls.rpFirstName.setValue(contactSearchResultStat.firstName);
      this.incidentForm.controls.rpLastName.setValue(contactSearchResultStat.lastName);
      this.incidentForm.controls.rpOrganization.setValue(contactSearchResultStat.organization);
      this.incidentForm.controls.rpCountry.setValue(contactSearchResultStat.country);
      this.incidentForm.controls.rpPhone.setValue(contactSearchResultStat.phone);
      this.incidentForm.controls.rpEmail.setValue(contactSearchResultStat.email);
      this.incidentForm.controls.rpZipcode.setValue(contactSearchResultStat.zipcode);
    }
    if (contactType === 'IC') {
      this.incidentForm.controls.icAddress.setValue(contactSearchResultStat.street);
      this.incidentForm.controls.icCity.setValue(contactSearchResultStat.city);
      this.incidentForm.controls.icState.setValue(contactSearchResultStat.state);
      this.incidentForm.controls.icFirstName.setValue(contactSearchResultStat.firstName);
      this.incidentForm.controls.icLastName.setValue(contactSearchResultStat.lastName);
      this.incidentForm.controls.icOrganization.setValue(contactSearchResultStat.organization);
      this.incidentForm.controls.icCountry.setValue(contactSearchResultStat.country);
      this.incidentForm.controls.icPhone.setValue(contactSearchResultStat.phone);
      this.incidentForm.controls.icEmail.setValue(contactSearchResultStat.email);
      this.incidentForm.controls.icZipcode.setValue(contactSearchResultStat.zipcode);
    }
  }
  private updateSiteAddress(ustSearchResultStat: UstSearchResultStat) {
    this.incidentForm.controls.facilityId.setValue(ustSearchResultStat.facilityId);
    this.incidentForm.controls.siteName.setValue(ustSearchResultStat.facilityName);
    this.incidentForm.controls.siteAddress.setValue(ustSearchResultStat.facilityAddress);
    this.incidentForm.controls.siteCity.setValue(ustSearchResultStat.facilityCity);
    this.incidentForm.controls.siteCounty.setValue(ustSearchResultStat.countyCode);
    this.incidentForm.controls.siteZipcode.setValue(ustSearchResultStat.facilityZip);
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
    // if  (this.acceptClicked) {
    //   return true;
    // }
    // if  (this.holdClicked) {
    //   return true;
    // }
    // if  (this.declineClicked) {
    //   return true;
    // }
    // if  (this.searchClicked) {
    //   return true;
    // }
    return false;
  }

  setShowContactInvoice() {
    this.incidentForm.controls.releaseType.valueChanges.subscribe(data => {
      if (data === 'R' || data === 'U') {
        this.showInvoiceContact = true;
        this.incidentForm.controls.icAddress.enable();
        this.incidentForm.controls.icFirstName.enable();
        this.incidentForm.controls.icLastName.enable();
        this.incidentForm.controls.icOrganization.enable();
        this.incidentForm.controls.icCity.enable();
        this.incidentForm.controls.icState.enable();
        this.incidentForm.controls.icZipcode.enable();
        this.incidentForm.controls.icPhone.enable();
        this.incidentForm.controls.icEmail.enable();
        this.incidentForm.controls.icCountry.enable();
        this.incidentForm.controls.icAddress.setValidators([Validators.required]);
        this.incidentForm.controls.icFirstName.setValidators([Validators.required]);
        this.incidentForm.controls.icLastName.setValidators([Validators.required]);
        this.incidentForm.controls.icOrganization.setValidators([Validators.required]);
        this.incidentForm.controls.icCity.setValidators([Validators.required]);
        this.incidentForm.controls.icState.setValidators([Validators.required]);
        this.incidentForm.controls.icZipcode.setValidators([Validators.required]);
        this.incidentForm.controls.icPhone.setValidators([Validators.required]);
        this.incidentForm.controls.icEmail.setValidators([Validators.required]);
      } else {
        this.showInvoiceContact = false;
        this.incidentForm.controls.icAddress.disable();
        this.incidentForm.controls.icAddress.setValidators(null);
        this.incidentForm.controls.icFirstName.disable();
        this.incidentForm.controls.icFirstName.setValidators(null);
        this.incidentForm.controls.icLastName.disable();
        this.incidentForm.controls.icLastName.setValidators(null);
        this.incidentForm.controls.icOrganization.disable();
        this.incidentForm.controls.icOrganization.setValidators(null);
        this.incidentForm.controls.icCity.disable();
        this.incidentForm.controls.icCity.setValidators(null);
        this.incidentForm.controls.icState.disable();
        this.incidentForm.controls.icState.setValidators(null);
        this.incidentForm.controls.icZipcode.disable();
        this.incidentForm.controls.icZipcode.setValidators(null);
        this.incidentForm.controls.icPhone.disable();
        this.incidentForm.controls.icPhone.setValidators(null);
        this.incidentForm.controls.icEmail.disable();
        this.incidentForm.controls.icEmail.setValidators(null);
        this.incidentForm.controls.icCountry.disable();
        this.incidentForm.controls.icCountry.setValidators(null);
      }
    } );
  }

  copyResponsibleToInvoice() {
    this.incidentForm.controls.icFirstName.setValue(this.incidentForm.controls.rpFirstName.value);
    this.incidentForm.controls.icLastName.setValue(this.incidentForm.controls.rpLastName.value);
    this.incidentForm.controls.icOrganization.setValue(this.incidentForm.controls.rpOrganization.value);
    this.incidentForm.controls.icAddress.setValue(this.incidentForm.controls.rpAddress.value);
    this.incidentForm.controls.icPhone.setValue(this.incidentForm.controls.rpPhone.value);
    this.incidentForm.controls.icCity.setValue(this.incidentForm.controls.rpCity.value);
    this.incidentForm.controls.icEmail.setValue(this.incidentForm.controls.rpEmail.value);
    this.incidentForm.controls.icState.setValue(this.incidentForm.controls.rpState.value);
    this.incidentForm.controls.icZipcode.setValue(this.incidentForm.controls.rpZipcode.value);
    this.incidentForm.controls.icCountry.setValue(this.incidentForm.controls.rpCountry.value);
  }

  submitIncident(): void {
    this.submitClicked = true;
    if (this.incidentForm.dirty && this.incidentForm.valid) {
        console.log('ok-valid form');
        this.createIncident();
    } else if (this.incidentForm.invalid) {
        console.log('not ok-invalid form');
        this.errors = this.findInvalidControls();
        console.log(this.errors);
        this.contaminantErrorMessage = this.getContaminantErrorMessage();
        if (this.contaminantErrorMessage != null) {
          this.contaminantErrorMessages = [this.contaminantErrorMessage];
          this.errors.push(this.contaminantErrorMessage);
          this.showContaminantErrorMessage = true;
        }
        this.mediaErrorMessage = this.getMediaErrorMessage();
        if (this.mediaErrorMessage != null) {
          this.mediaErrorMessages = [this.mediaErrorMessage];
          this.errors.push(this.mediaErrorMessage);
          this.showMediaErrorMessage = true;
        }
        this.showAllErrorsMessages = true;
        this.isClosed = false;
        this.isContaminantClosed = false;
        this.isMediaClosed = false;
        console.log('ok why the errors not showing?????');
    } else if (!this.incidentForm.dirty) {
        this.onCreateComplete();
    }
  }
  createIncident(): void {
    this.updateBooleanToNumber();
    const p = Object.assign({},  this.incidentForm.value, this.incident);

    console.log('*********p is ' + JSON.stringify(p));

    this.lustDataService.createIncident(p)
        .subscribe(
            () => this.onCreateComplete(),
            (error: any) => this.errorMessage = <any>error
        );
  }

  onCreateComplete(): void {
    console.log('ok did it hip hip hoorayyy!!!!');
    // this.showSubmitStatusDialog();

  }

  private findInvalidControls() {
    const invalid = [];
    const controls = this.incidentForm.controls;
    for (const field of Object.keys(this.incidentForm.controls)) {
        if (this.incidentForm.controls[field].invalid) {
            console.log('****findInvalidControls');
            console.log(field);
            const name = this.idToNameService.getName(field);
            invalid.push(name + ' is required and must be valid.');
        }
    }

    const contaminantErrorMessage = this.getContaminantErrorMessage();
    if (contaminantErrorMessage != null) {
      invalid.push(contaminantErrorMessage);
    }

    const mediaErrorMessage = this.getMediaErrorMessage();
    if (mediaErrorMessage != null) {
      invalid.push(mediaErrorMessage);
    }

    return invalid;
  }

  private getMediaErrorMessage(): string {
    if (this.incidentForm.controls.groundWater.value || this.incidentForm.controls.surfaceWater.value ||
      this.incidentForm.controls.drinkingWater.value || this.incidentForm.controls.soil.value ||
      this.incidentForm.controls.vapor.value || this.incidentForm.controls.freeProduct.value
    ) { return null; } else {
      this.showMediaErrorMessage = true;
      return('Must select at least one Media.');
    }
  }
  private getContaminantErrorMessage(): string {
    if (this.incidentForm.controls.heatingOil.value || this.incidentForm.controls.unleadedGas.value ||
      this.incidentForm.controls.leadedGas.value || this.incidentForm.controls.misGas.value ||
      this.incidentForm.controls.diesel.value || this.incidentForm.controls.wasteOil.value ||
      this.incidentForm.controls.lubricant.value || this.incidentForm.controls.solvent.value ||
      this.incidentForm.controls.otherPet.value || this.incidentForm.controls.chemical.value ||
      this.incidentForm.controls.unknown.value || this.incidentForm.controls.mtbe.value
    ) { return null; } else {
      this.showContaminantErrorMessage = true;
      return('Must select at least one Contaminant.');
    }
  }

  private updateBooleanToNumber() {
    this.lustIncident.groundWater = (this.incidentForm.controls.groundWater.value ? 1 : 0);
    this.lustIncident.surfaceWater = (this.incidentForm.controls.surfaceWater.value ? 1 : 0);
    this.lustIncident.drinkingWater = (this.incidentForm.controls.drinkingWater.value ? 1 : 0);
    this.lustIncident.soil = (this.incidentForm.controls.soil.value ? 1 : 0);
    this.lustIncident.vapor = (this.incidentForm.controls.vapor.value ? 1 : 0);
    this.lustIncident.freeProduct = (this.incidentForm.controls.freeProduct.value ? 1 : 0);
    this.lustIncident.unleadedGas = (this.incidentForm.controls.unleadedGas.value ? 1 : 0);
    this.lustIncident.leadedGas = (this.incidentForm.controls.leadedGas.value  ? 1 : 0);
    this.lustIncident.misGas = (this.incidentForm.controls.misGas.value  ? 1 : 0);
    this.lustIncident.diesel = (this.incidentForm.controls.diesel.value  ? 1 : 0);
    this.lustIncident.wasteOil = (this.incidentForm.controls.wasteOil.value  ? 1 : 0);
    this.lustIncident.heatingOil = (this.incidentForm.controls.heatingOil.value ? 1 : 0);
    this.lustIncident.lubricant = (this.incidentForm.controls.lubricant.value ? 1 : 0);
    this.lustIncident.solvent = (this.incidentForm.controls.solvent.value  ? 1 : 0);
    this.lustIncident.otherPet = (this.incidentForm.controls.otherPet.value  ? 1 : 0);
    this.lustIncident.chemical = (this.incidentForm.controls.chemical.value  ? 1 : 0);
    this.lustIncident.unknown = (this.incidentForm.controls.unknown.value  ? 1 : 0);
    this.lustIncident.mtbe = (this.incidentForm.controls.mtbe.value ? 1 : 0);
    // this.lustIncident.siteAddress = this.incidentForm.controls.streetNbr.value + ' '
    //         + this.incidentForm.controls.streetQuad.value + ' '
    //         + this.incidentForm.controls.streetName.value + ' '
    //         + this.incidentForm.controls.streetType.value;
    // this.lustIncident.discoveryDate = this.incidentForm.controls['discoveryDate'].value;
    // this.lustIncident.dateReceived = this.incidentForm.controls.dateReceived.value;

    // console.log(this.incidentForm.invalid);

    // console.log('*********this.incidentForm is ');
    // console.log(this.incidentForm.value);
    // console.log('*********this.incident is ' );
    // console.log( JSON.stringify(this.lustIncident));

  }

  private openLit() {
    if (typeof this.incidentForm.controls.authUser.value !== 'undefined'
      && this.incidentForm.controls.authUser.value
      && this.incidentForm.controls.authUser.value.length > 0) {
      this.authRequired = false;
      const params = encodeURI('LUST' + this.incidentForm.controls.authUser.value + '&address='
                        + this.incidentForm.controls.siteAddress.value + '&city=' + this.incidentForm.controls.siteCity.value +  '&zip='
                        + this.incidentForm.controls.siteZipcode.value + '&facname=' + this.incidentForm.controls.siteName.value);
        const lit_url = environment.lit_site_setup + params;
        window.open(lit_url, '_blank');
    } else {
      this.authRequired = true;
    }
  }

  getAuthUserErrorMessage(): string {
    return 'Auth User required for opening LIT.....';
  }

}
