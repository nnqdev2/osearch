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

@Component({
  selector: 'app-lust-incident-create',
  templateUrl: './lust-incident-create.component.html',
  styleUrls: ['./lust-incident-create.component.scss']
})
export class LustIncidentCreateComponent implements OnInit, OnDestroy  {
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


  private contactSubscription: Subscription;
  private ustSubscription: Subscription;
  private selectedContact: ContactSearchResultStat;
  private selectedUst: UstSearchResultStat;
  private dialogResult: any;


  constructor(private lustDataService: LustDataService, private formBuilder: FormBuilder, private datePipe: DatePipe
    , private route: ActivatedRoute, private router: Router, private addressCorrectDataService: AddressCorrectDataService
    , private canDeactivateDialog: MatDialog, private searchDialog: MatDialog, private selectedDataService: SelectedDataService
  ) {  }

  ngOnInit() {
    this.route.data.subscribe((data: {siteTypes: SiteType[]}) => {this.siteTypes = data.siteTypes; });
    this.route.data.subscribe((data: {confirmationTypes: ConfirmationType[]}) => {this.confirmationTypes = data.confirmationTypes; });
    this.route.data.subscribe((data: {discoveryTypes: DiscoveryType[]}) => {this.discoveryTypes = data.discoveryTypes; });
    this.route.data.subscribe((data: {releaseCauseTypes: ReleaseCauseType[]}) => {this.releaseCauseTypes = data.releaseCauseTypes; });
    this.route.data.subscribe((data: {sourceTypes: SourceType[]}) => {this.sourceTypes = data.sourceTypes; });
    this.route.data.subscribe((data: {cities: City[]}) => {this.cities = data.cities; });
    this.route.data.subscribe((data: {states: State[]}) => {this.states = data.states; });
    this.route.data.subscribe((data: {zipCodes: ZipCode[]}) => {this.zipcodes = data.zipCodes; });
    this.route.data.subscribe((data: {counties: County[]}) => {this.counties = data.counties; });
    this.createForm();
    this.maxDate = new Date();
    this.maxDate.setDate( this.maxDate.getDate());
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
        streetQuad:  ['', Validators.compose([Validators.maxLength(2)])],
        streetName:  ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
        streetType: ['', Validators.compose([Validators.maxLength(10)])],
        siteAddress:   [{value: '', disabled: true}],
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
        rpAddress2: ['',Validators.compose([Validators.maxLength(40)])],
        rpCity:  ['', Validators.compose([Validators.required, Validators.maxLength(25)])],
        rpState:  ['', Validators.compose([Validators.required, Validators.maxLength(2)])],
        rpZipcode: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
        rpPhone:  ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
        rpEmail:  ['', Validators.compose([Validators.email, Validators.maxLength(30)])],
        icFirstName:  ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
        icLastName: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
        icOrganization:  ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
        icAddress:  ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
        icAddress2: ['', Validators.compose([Validators.maxLength(40)])],
        icCity:  ['', Validators.compose([Validators.required, Validators.maxLength(25)])],
        icState:  ['', Validators.compose([Validators.required, Validators.maxLength(2)])],
        icZipcode: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
        icPhone:  ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
        icEmail:  ['', Validators.compose([Validators.email, Validators.maxLength(30)])],
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
        deqOffice: ['']
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
    // if ((addressType === 'sa')
    // && (this.saAddressCorrectStat.Records[0].PostalCode.length < 5)) {
    //   return true;
    // }
    // if ((addressType === 'rp')
    // && (this.rpAddressCorrectStat.Records[0].PostalCode.length < 5)) {
    //   return true;
    // }
    // if ((addressType === 'ic')
    // && (this.icAddressCorrectStat.Records[0].PostalCode.length < 5)) {
    //   return true;
    // }
    return true;
  }

  runSaAddressCorrect() {
    if (this.incidentForm.controls.siteAddress.value.length > 0 ) {
      this.showSaAddressCorrect = true;
    }

    // this.addressCorrectDataService.getAddressCorrectStat(this.incidentForm.controls.siteAddress.value
    //   , this.incidentForm.controls.siteCity.value, 'OR')
    //   .pipe(
    //     map(addressCorrectData => {
    //       this.saAddressCorrectStat = addressCorrectData,
    //       this.countyFips = addressCorrectData.Records[0].CountyFIPS.substring(2);
    //     }),
    //     flatMap(() => this.lustDataService.getPostalCountyVerification(+this.incidentForm.controls.countyCode.value, this.countyFips)
    //     ),
    // )
    // .subscribe(
    //   (data => {
    //     this.refreshSaAddressCorrect(data);
    //   } )
    // );
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


  private openUstSearch() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      searchType: 'UST',
    };
    this.searchDialogRef = this.searchDialog.open(SearchDialogComponent, dialogConfig);
  }

  private openContactSearch(contactType: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    // dialogConfig.disableClose =  true;
    dialogConfig.data = {
      searchType: 'Contact',
      contactType: contactType,
      component: {component: ContactSearchFilterComponent}
    };
    this.searchDialogRef = this.searchDialog.open(SearchDialogComponent, dialogConfig);

    this.searchDialogRef.afterClosed().subscribe(result => {
      console.log('dialog closed returned:.......');
      console.log(result);
      this.selectedContact = result;
      console.log(`Dialog after closed: ${this.selectedContact}`);
      this.updateContact(contactType, result);


      // this.contactSubscription = this.selectedDataService.contactDataSelected$.subscribe(selectedData => {
      // this.selectedDataService.contactDataSelected$.subscribe(selectedData => {
      //   this.selectedContact = selectedData;
      //   console.log(`this.selectedContact: ${this.selectedContact}`);
      //   if ( this.dialogResult === undefined && this.selectedContact === null) {
      //     console.log(`user didn't do anything....`);
      //   } else {
      //     if (contactType === 'RP') {
      //       console.log('UPDATE RP info');
      //     } else {
      //       console.log('UPDATE IC info');
      //     }
      //   }



      // });

    });



  }

  private updateContact(contactType: string, contactSearchResultStat: ContactSearchResultStat) {
    console.log('updateContact(contactType: string, contactSearchResultStat: ContactSearchResultStat)');
    console.log(contactType);
    console.log(contactSearchResultStat);
  }

  private openContactSearchORIG(contactType: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    // dialogConfig.disableClose =  true;
    dialogConfig.data = {
      searchType: 'Contact',
      contactType: contactType,
    };

    console.log('HELLLLLLLLLLLLLLLLLLLLLLLLLLLPPPPPPPPPPPPPPPPPPPPP');
    console.log(dialogConfig.data);
    this.searchDialogRef = this.searchDialog.open(SearchDialogComponent, dialogConfig);

    this.searchDialogRef.afterClosed().subscribe(result => {
      console.log(`***** HELP!!!! selected row is ....: ${result}`);
      this.dialogResult = result;

      // this.contactSubscription = this.selectedDataService.contactDataSelected$.subscribe(selectedData => {
      //   this.selectedContact = selectedData;
      //   console.log(`this.selectedContact: ${this.selectedContact}`);
      //   if ( this.dialogResult === undefined && this.selectedContact === null) {
      //     console.log(`user didn't do anything....`);
      //   } else {
      //     if (contactType === 'RP') {
      //       console.log('UPDATE RP info');
      //     } else {
      //       console.log('UPDATE IC info');
      //     }
      //   }



      // });

    });



  }


  ngOnDestroy() {
    // this.contactSubscription.unsubscribe();
  }

}

