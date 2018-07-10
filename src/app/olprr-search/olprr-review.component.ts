import { Component, OnInit, SimpleChanges} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap, CanDeactivate } from '@angular/router';

import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';
import { Observable, of, Subject, forkJoin, combineLatest, BehaviorSubject} from 'rxjs';
import { map, catchError, tap, retry, finalize, flatMap, mergeMap, delay} from 'rxjs/operators';

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
import { Incident } from '../models/incident';
import { IncidentValidators } from '../validators/incident.validator';
import { ConfigService } from '../common/config.service';
import { IncidentIdToNameService } from './incident-id-to-name.service';
import { IncidentData } from '../models/incident-data';
import { AddressCorrectDataService } from '../services/address-correct-data.service';
import { AddressCorrectStat } from '../models/address-correct-stat';
import { PostalCountyVerification } from '../models/postal-county-verification';
import { AddressCorrect } from '../models/address-correct';
import { AcceptDialogComponent } from './accept-dialog.component';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ShowErrorsComponent } from '../show-errors/show-errors.component';
import { DialogService } from '../common/dialogs/dialog.service';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { GuardDialogComponent } from '../common/dialogs/guard-dialog.component';
import { UstSearchFilterComponent } from '../ust-search/ust-search-filter.component';
import { SearchDialogComponent } from './search-dialog.component';
import { PdfService } from '../common/pdf.service';

@Component({
  selector: 'app-olprr-review',
  templateUrl: './olprr-review.component.html',
  styleUrls: ['./olprr-review.component.scss'],
})
export class OlprrReviewComponent implements OnInit, CanDeactivateGuard {

  guardDialogRef: MatDialogRef<GuardDialogComponent, any>;
  searchDialogRef: MatDialogRef<SearchDialogComponent, any>;
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
  submitClicked = false;
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


  panelOpenState = false;
  public showSiteAddressCompare = true;
  public showResponsiblePartyAddressCompare = true;
  public showInvoiceContactAdressCompare = true;
  public showLITButtons = true;


  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private lustDataService: LustDataService, private formBuilder: FormBuilder, private datePipe: DatePipe
    , private configService: ConfigService, private idToNameService: IncidentIdToNameService, private route: ActivatedRoute
    , private router: Router, private addressCorrectDataService: AddressCorrectDataService
    , private canDeactivateDialog: MatDialog, private searchDialog: MatDialog
    , private pdfService: PdfService
  ) {}

  ngOnInit() {
    this.olprrId = +this.route.snapshot.params['olprrid'];
    this.loadingSubject.next(true);
    // this.route.data.subscribe((data: {incidentData: IncidentData}) => {this.incidentData = data.incidentData; } );
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
        mergeMap(saCheck => this.addressCorrectDataService.getAddressCorrectStat
              (this.incidentData.siteAddress, this.incidentData.siteCity, 'OR')
              .pipe(
                map(addressCorrect => {
                  this.saAddressCorrectStat = addressCorrect;
                  this.countyFips = addressCorrect.Records[0].CountyFIPS.substring(2);
                  if (this.countyFips == null) {
                    this.countyFips = '000';
                  }
                }),
              ) // pipe end
        ),  // flatmap end

        mergeMap(countyCheck => this.lustDataService.getPostalCountyVerification
              (+this.incidentData.siteCounty, this.countyFips)
              .pipe(
                map(countyCheckData => {
                  this.postalCountyVerification = countyCheckData;
                })
              ) // pipe end
        ), // flatmap end

        mergeMap(saCheck => this.addressCorrectDataService.getAddressCorrectStat
          (this.incidentData.rpAddress, this.incidentData.rpCity, this.incidentData.rpState)
          .pipe(
            map(addressCorrect => {
              this.rpAddressCorrectStat = addressCorrect;
            }),
          ) // pipe end
        ),  // flatmap end

        mergeMap(icCheck => this.addressCorrectDataService.getAddressCorrectStat
          (this.incidentData.icAddress, this.incidentData.icCity, this.incidentData.icState)
          .pipe(
            map(addressCorrect => {
              this.icAddressCorrectStat = addressCorrect;
              console.log(this.icAddressCorrectStat);
            }
            )
          ) // pipe end
        ),  // flatmap end

      )  // pipe end
      .subscribe(
        (data => {
          this.loadingSubject.next(false);
          this.setShowContactInvoice();
          this.createForm();
        } )
      );

  }

  private print(): void {
    window.print();
  }

  private pdfGenerate(): void {
    this.pdfService.createOlprrPdfIncident(this.incidentData);
  }

  createForm() {
    this.incidentForm = this.formBuilder.group({
        olprrId:          [{value: this.incidentData.olprrId, disabled: true}],
        contractorEmail:  [{value: this.incidentData.contractorEmail, disabled: true}],
        reportedBy:       [{value: this.incidentData.reportedBy, disabled: true}],
        reportedByPhone:  [{value: this.incidentData.reportedByPhone, disabled: true}],
        reportedByEmail:  ['', [Validators.email]],
        // reportedByEmail:  ['', [Validators.required, Validators.email]],
        releaseType:      [{value: this.incidentData.releaseTypeCode, disabled: true}],
        dateReceived:     [{value: this.transformDate(this.incidentData.dateReceived), disabled: true}],
        facilityId:       [{value: this.incidentData.facilityId, disabled: true}],
        siteName:         [this.incidentData.siteName, Validators.required],
        siteCounty:       [+this.incidentData.siteCounty, Validators.required],
        countyCode:       [+this.incidentData.countyCode, Validators.required],
        siteAddress:      [this.incidentData.siteAddress],
        siteCity:         [this.incidentData.siteCity, Validators.required],
        siteZipcode:      [this.incidentData.siteZipcode, Validators.required],
        sitePhone:        [this.incidentData.sitePhone],
        company:          [{value: this.incidentData.contractorName, disabled: true}],
        initialComment:   [{value: this.incidentData.siteComment, disabled: true}],
        discoveryDate:    [{value: this.transformDate(this.incidentData.discoveryDate), disabled: true}],
        confirmationCode: [{value: this.incidentData.confirmationCode, disabled: true}],
        discoveryCode:    [{value: this.incidentData.discoveryCode, disabled: true}],
        causeCode:        [{value: this.incidentData.causeCode, disabled: true}],
        sourceId:         [{value: this.incidentData.sourceId, disabled: true}],
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
        saAddressCorrectCounty:  [{value: this.countyFips, disabled: true}],
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
      },
      {validator: [IncidentValidators.selectOneOrMoreMedia, IncidentValidators.selectOneOrMoreContaminants] }
    );

    if (this.incidentData.releaseTypeCode !== 'H') {
      this.incidentForm.controls.icAddress.setValidators([Validators.required]);
      this.incidentForm.controls.icAddress2.setValidators([Validators.required]);
      this.incidentForm.controls.icFirstName.setValidators([Validators.required]);
      this.incidentForm.controls.icLastName.setValidators([Validators.required]);
      this.incidentForm.controls.icOrganization.setValidators([Validators.required]);
      this.incidentForm.controls.icCity.setValidators([Validators.required]);
      this.incidentForm.controls.icState.setValidators([Validators.required]);
      this.incidentForm.controls.icZipcode.setValidators([Validators.required]);
      this.incidentForm.controls.icPhone.setValidators([Validators.required]);
      this.incidentForm.controls.icEmail.setValidators([Validators.required]);
    }
  }

  addressCorrectNotFound(addressType: string): boolean {
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

  private showAddressCorrect(addressType: string): boolean {
    if ((addressType === 'sa')
    && (this.incidentData.siteAddress === this.saAddressCorrectStat.Records[0].AddressLine1
    && this.incidentData.siteZipcode.toString() === this.saAddressCorrectStat.Records[0].PostalCode
    && this.incidentData.siteCounty === this.countyFips)) {
      return false;
    }
    if ((addressType === 'rp')
    && (this.incidentData.siteAddress === this.rpAddressCorrectStat.Records[0].AddressLine1
    && this.incidentData.siteCity === this.rpAddressCorrectStat.Records[0].City
    && this.incidentData.siteZipcode.toString() === this.rpAddressCorrectStat.Records[0].PostalCode) ) {
        return false;
    }
    if ((addressType === 'ic')
    && (this.incidentData.siteAddress === this.icAddressCorrectStat.Records[0].AddressLine1
    && this.incidentData.siteCity === this.icAddressCorrectStat.Records[0].City
    && this.incidentData.siteZipcode.toString() === this.icAddressCorrectStat.Records[0].PostalCode)) {
        return false;
    }
    return true;
  }

  setShowContactInvoice() {
    if (typeof this.incidentData.releaseTypeCode !== 'undefined'
    && (this.incidentData.releaseTypeCode === 'R' || this.incidentData.releaseTypeCode === 'U')) {
      this.showInvoiceContact = true;
    } else {
      this.showInvoiceContact = false;
    }
  }

  submitIncident(): void {
    console.log('submitIncident()');
    console.log(this.incidentForm.invalid);
    console.log(this.incidentForm.valid);
    console.log(this.incidentForm.dirty);
    console.log(this.incidentForm.pristine);
    this.submitClicked = true;
    // this.getAddressCorrection(this.incidentData.siteAddress, this.incidentData.siteCity, this.incidentData.siteCounty)

    if (this.incidentForm.dirty && this.incidentForm.valid) {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!ok-valid form');
        this.getAddressCorrection(this.incidentData.siteAddress, this.incidentData.siteCity, this.incidentData.siteCounty, 'OR');
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
    } else if (!this.incidentForm.dirty && this.incidentForm.pristine) {
        // this.getAddressCorrection(this.incidentData.siteAddress, this.incidentData.siteCity, this.incidentData.siteCounty);
        this.onCreateComplete();
    }
  }
  createIncident(): void {
    this.updateBooleanToNumber();
    this.incidentForm.controls.deqOffice.setValue(this.getDeqOffice());
    this.incidentForm.controls.contractorUid.setValue(environment.contractor_uid);
    this.incidentForm.controls.contractorPwd.setValue(environment.contractor_pwd);
    this.incidentForm.controls.siteAddress.setValue(`${this.incidentForm.controls.streetNbr.value} `
      + `${this.incidentForm.controls.streetQuad.value} `
      + `${this.incidentForm.controls.streetName.value} `
      + `${this.incidentForm.controls.streetType.value} `);
    const ngbDate = this.incidentForm.controls['discoveryDate'].value;
    const myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    this.incidentForm.controls['discoveryDate'].setValue(myDate);
    this.incidentForm.controls['submitDateTime'].setValue(myDate);
    this.incidentData.dateReceived = (this.incidentForm.controls.dateReceived.value);

    console.log('*********this.incidentForm is ');
    console.log(this.incidentForm.value);
    console.log('*********this.incident is ' );
    console.log( JSON.stringify(this.incidentData));

    // Copy the form values over the product object values
    const p = Object.assign({}, this.incidentData, this.incidentForm.value);

    console.log('*********p is ' + JSON.stringify(p));

    this.lustDataService.createIncident(p)
        .subscribe(
            () => this.onCreateComplete(),
            (error: any) => this.errorMessage = <any>error
        );
  }

  onCreateComplete(): void {
    console.log('ok did it hip hip hoorayyy!!!!');
    // this.resetForm();
    // this.incidentForm.reset();
    // this.resetFlags();
    // this.incidentForm.patchValue({
    //   dateReceived: this.datePipe.transform(new Date(), 'MM-dd-yyyy')
    // });

  }

  resetFlags() {
    this.showAllErrorsMessages = false;
    this.submitClicked = false;
    this.showContaminantErrorMessage = false;
    this.showMediaErrorMessage = false;
    this.isClosed = true;
    this.isContaminantClosed = true;
    this.isMediaClosed = true;
    this.contaminantErrorMessage = null;
    this.mediaErrorMessage = null;
  }

  resetDate(): void {
    // this.incidentForm.patchValue({
    //   dateReceived: this.datePipe.transform(new Date(), 'MM/dd/yyyy')
    // });
  }

  resetForm(): void {
    // this.incidentForm.reset();
    // this.resetFlags();
    // this.incidentForm.patchValue({
    //   dateReceived: this.datePipe.transform(new Date(), 'MM-dd-yyyy')
    // });
    this.incidentForm.reset();
    this.resetFlags();
    this.resetDate();
  }

  transformDate(inDate: Date): string {
    return this.datePipe.transform(inDate, 'MM/dd/yyyy');
  }

  private getDeqOffice(): string {
    let deqOffice = 'NWR';
    if (this.incidentForm.controls.releaseType.value === 'H') {
       return deqOffice = 'NWR';
    }
    switch (this.incidentForm.controls.siteCounty.value) {
      case'1':  case'7':   case'9':    case'11':   case'12':  case'13':
      case'14': case'16':  case'18':   case'19':   case'23':  case'25':
      case'28': case'30':  case'31':   case'32':   case'33':  case'35':
      deqOffice = 'DAL';
      break;
    case'20':
      deqOffice = 'EUG';
      break;
    case'6':  case'8':  case'10':   case'15':  case'17':
      deqOffice = 'MDF';
      break;
    case'2':  case'21':  case'22':  case'24':  case'27':   case'36':
      deqOffice = 'SLM';
      break;
    default:
      deqOffice = 'NWR';
      break;
    }
    return deqOffice;
  }

  private findInvalidControls() {
    const invalid = [];
    const controls = this.incidentForm.controls;
    for (const field of Object.keys(this.incidentForm.controls)) {
        if (this.incidentForm.controls[field].invalid) {
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

  private findInvalidControlsOrig() {
    const invalid = [];
    const controls = this.incidentForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            console.error('###################********** offending element ===>' + name);
            console.error(name);
            invalid.push(name + ' is required and must be valid.');
        }
    }
    return invalid;
  }


  private updateBooleanToNumber() {
    // for (const field of Object.keys(this.incidentForm.controls)) {
    //   if ( typeof this.incidentForm.controls[field].value === 'boolean') {
    //     console.log('************updateBooleanToNumber() boolean boolean');
    //     console.log(field);
    //     const xx = this.incidentForm.controls[field].value;
    //     if (xx) {
    //       this.incidentForm.controls[field].setValue(1);
    //     } else {
    //       this.incidentForm.controls[field].setValue(0);
    //     }
    //   }
    // )
    if (this.incidentForm.controls.groundWater.value === false) {
      this.incidentForm.controls.groundWater.setValue(0);
    }
    if (this.incidentForm.controls.groundWater.value === true) {
      this.incidentForm.controls.groundWater.setValue(1);
    }
    if (this.incidentForm.controls.surfaceWater.value === false) {
      this.incidentForm.controls.surfaceWater.setValue(0);
    }
    if (this.incidentForm.controls.surfaceWater.value === true) {
      this.incidentForm.controls.surfaceWater.setValue(1);
    }
    if (this.incidentForm.controls.drinkingWater.value === false) {
      this.incidentForm.controls.drinkingWater.setValue(0);
    }
    if (this.incidentForm.controls.drinkingWater.value === true) {
      this.incidentForm.controls.drinkingWater.setValue(1);
    }
    if (this.incidentForm.controls.soil.value === false) {
      this.incidentForm.controls.soil.setValue(0);
    }
    if (this.incidentForm.controls.soil.value === true) {
      this.incidentForm.controls.soil.setValue(1);
    }
    if (this.incidentForm.controls.vapor.value === false) {
      this.incidentForm.controls.vapor.setValue(0);
    }
    if (this.incidentForm.controls.vapor.value === true) {
      this.incidentForm.controls.vapor.setValue(1);
    }
    if (this.incidentForm.controls.freeProduct.value === false) {
      this.incidentForm.controls.freeProduct.setValue(0);
    }
    if (this.incidentForm.controls.freeProduct.value === true) {
      this.incidentForm.controls.freeProduct.setValue(1);
    }

    if (this.incidentForm.controls.unleadedGas.value === false) {
      this.incidentForm.controls.unleadedGas.setValue(0);
    }
    if (this.incidentForm.controls.unleadedGas.value === true) {
      this.incidentForm.controls.unleadedGas.setValue(1);
    }
    if (this.incidentForm.controls.leadedGas.value === false) {
      this.incidentForm.controls.leadedGas.setValue(0);
    }
    if (this.incidentForm.controls.leadedGas.value === true) {
      this.incidentForm.controls.leadedGas.setValue(1);
    }


    if (this.incidentForm.controls.misGas.value === false) {
      this.incidentForm.controls.misGas.setValue(0);
    }
    if (this.incidentForm.controls.misGas.value === true) {
      this.incidentForm.controls.misGas.setValue(1);
    }
    if (this.incidentForm.controls.diesel.value === false) {
      this.incidentForm.controls.diesel.setValue(0);
    }
    if (this.incidentForm.controls.diesel.value === true) {
      this.incidentForm.controls.diesel.setValue(1);
    }


    if (this.incidentForm.controls.wasteOil.value === false) {
      this.incidentForm.controls.wasteOil.setValue(0);
    }
    if (this.incidentForm.controls.wasteOil.value === true) {
      this.incidentForm.controls.wasteOil.setValue(1);
    }
    if (this.incidentForm.controls.heatingOil.value === false) {
      this.incidentForm.controls.heatingOil.setValue(0);
    }
    if (this.incidentForm.controls.heatingOil.value === true) {
      this.incidentForm.controls.heatingOil.setValue(1);
    }


    if (this.incidentForm.controls.lubricant.value === false) {
      this.incidentForm.controls.lubricant.setValue(0);
    }
    if (this.incidentForm.controls.lubricant.value === true) {
      this.incidentForm.controls.lubricant.setValue(1);
    }
    if (this.incidentForm.controls.solvent.value === false) {
      this.incidentForm.controls.solvent.setValue(0);
    }
    if (this.incidentForm.controls.solvent.value === true) {
      this.incidentForm.controls.solvent.setValue(1);
    }


    if (this.incidentForm.controls.otherPet.value === false) {
      this.incidentForm.controls.otherPet.setValue(0);
    }
    if (this.incidentForm.controls.otherPet.value === true) {
      this.incidentForm.controls.otherPet.setValue(1);
    }
    if (this.incidentForm.controls.chemical.value === false) {
      this.incidentForm.controls.chemical.setValue(0);
    }
    if (this.incidentForm.controls.chemical.value === true) {
      this.incidentForm.controls.chemical.setValue(1);
    }


    if (this.incidentForm.controls.unknown.value === false) {
      this.incidentForm.controls.unknown.setValue(0);
    }
    if (this.incidentForm.controls.unknown.value === true) {
      this.incidentForm.controls.unknown.setValue(1);
    }
    if (this.incidentForm.controls.mtbe.value === false) {
      this.incidentForm.controls.mtbe.setValue(0);
    }
    if (this.incidentForm.controls.mtbe.value === true) {
      this.incidentForm.controls.mtbe.setValue(1);
    }

  }



  runSaAddressCorrect() {
    this.addressCorrectDataService.getAddressCorrectStat(this.incidentForm.controls.siteAddress.value
      , this.incidentForm.controls.siteCity.value, 'OR')
      .pipe(
        map(addressCorrectData => {
          this.saAddressCorrectStat = addressCorrectData,
          this.countyFips = addressCorrectData.Records[0].CountyFIPS.substring(2);
          console.log('***********************HELP**************');
          console.log(this.incidentForm.controls.countyCode);
        }),
        // delay(7000000000000000000000000000000000000),
        flatMap(countyCheck => this.lustDataService.getPostalCountyVerification
          (+this.incidentForm.controls.countyCode.value, this.countyFips)
        ),


    )
    .subscribe(
      (data => {
        this.postalCountyVerification = data;
        console.log('this.postalCountyVerification is .....');
        console.log(this.postalCountyVerification);
        console.log('this.saAddressCorrectStat is .....');
        console.log(this.saAddressCorrectStat);
      } )
    );
     console.log('getAddressCorrection done');
  }



  getAddressCorrection(address: string, city: string, reportedCountyCode: string, state: string) {
    console.log('getAddressCorrection');
    this.addressCorrectDataService.getAddressCorrectStat(address, city, state)
      .pipe(
        map(melissaData => {
          this.addressCorrectStat = melissaData,
          this.countyFips = melissaData.Records[0].CountyFIPS.substring(2);
        }),
        flatMap(countyCheck => this.lustDataService.getPostalCountyVerification(+reportedCountyCode, this.countyFips)
        )
    )
    .subscribe(
      (data => {
        this.postalCountyVerification = data;
        console.log('this.postalCountyVerification is .....');
        console.log(this.postalCountyVerification);
        console.log('this.addressCorrectStat is .....');
        console.log(this.addressCorrectStat);
        this.openAcceptDialog();
      } )
    );
     console.log('getAddressCorrection done');
  }

  openAcceptDialog() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    // dialogConfig.height = '500px';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      incidentData: this.incidentData,
      addressCorrect: this.addressCorrect,
      postalCountyVerification: this.postalCountyVerification
    };
    this.canDeactivateDialog.open(AcceptDialogComponent, dialogConfig);
}

  canDeactivate(): Observable<boolean> | boolean {
    if (this.incidentForm.pristine) {
      return true;
    }
    const choice: Subject<boolean> = new Subject<boolean>();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Discard changes?',
      message1: 'The form has not been submitted yet, do you really want to leave page?',
      button1: 'Leave',
      button2: 'Stay'
    };
    this.guardDialogRef = this.canDeactivateDialog.open(GuardDialogComponent, dialogConfig);
    this.guardDialogRef.afterClosed().subscribe(result => {
      choice.next(result);
    });
    return choice;
  }

  // getAddressCorrectionOrig(address: string, city: string, reportedCountyCode: string) {
  //   console.log('getAddressCorrection');
  //   this.addressCorrectDataService.getAddressCorrectStat(address, city)
  //   .pipe(
  //     map(data => {
  //       this.addressCorrectStat = data,
  //       this.countyFips = data.Records[0].CountyFIPS.substring(2);
  //     })
  //   )
  //   .subscribe(
  //     (data => {
  //       console.log('this.addressCorrectDataService.getAddressCorrectStat(address, city) -- subscribing'),
  //       // this.addressCorrectStat = data,
  //       // console.log(this.addressCorrectStat.Records[0].CountyFIPS);
  //       console.log(this.addressCorrectStat);
  //       console.log(this.addressCorrectStat.Records[0].CountyFIPS);
  //       console.log(this.countyFips);
  //       this.lustDataService.getPostalCountyVerification(+reportedCountyCode, this.countyFips)
  //       .pipe(

  //       )
  //       .subscribe(data1 => {
  //         this.postalCountyVerification = data1;
  //         console.log('this.lustDataService.getPostalCountyVerification we made it to here!!!!!!!');
  //         console.log(this.postalCountyVerification);
  //       } );
  //     } )
  //   );
  //    console.log('getAddressCorrection done');
  // }


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

  cancel() {
    this.router.navigate(['osearch']);
  }


}
