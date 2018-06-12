import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';
import { Observable} from 'rxjs';
import { map, catchError, tap, retry} from 'rxjs/operators';

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

@Component({
  selector: 'app-olprr-review',
  templateUrl: './olprr-review.component.html',
  styleUrls: ['./olprr-review.component.css']
})
export class OlprrReviewComponent implements OnInit, OnChanges {


  olprrId: number;
  // incidentData: Incident = new Incident();
  incidentData: IncidentData;
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

  constructor(private lustDataService: LustDataService, private formBuilder: FormBuilder, private datePipe: DatePipe
    , private configService: ConfigService, private idToNameService: IncidentIdToNameService, private route: ActivatedRoute
    , private router: Router) {}


  ngOnInit() {
    this.olprrId = +this.route.snapshot.params['olprrid'];
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

    console.log('olprr review init this.incidentData');
    console.log(this.incidentData);
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void { }

  createForm() {
    this.incidentForm = this.formBuilder.group({
        contractorEmail:  [{value: this.incidentData.contractorEmail, disabled: true}],
        reportedBy:       [{value: this.incidentData.reportedBy, disabled: true}],
        reportedByPhone:  [{value: this.incidentData.reportedByPhone, disabled: true}],
        reportedByEmail:  ['', [Validators.required, Validators.email]],
        releaseType:      [{value: this.incidentData.releaseTypeCode, disabled: true}],
        dateReceived:     [{value: this.incidentData.dateReceived, disabled: true}],
        facilityId:       [this.incidentData.facilityId],
        siteName:         [this.incidentData.siteName, Validators.required],
        siteCounty:       [this.incidentData.siteCounty, Validators.required],
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
        rpFirstName:  [this.incidentData.rpFirstName, Validators.required],
        rpLastName: [this.incidentData.rpLastName, Validators.required],
        rpOrganization:  [this.incidentData.rpOrganization, Validators.required],
        rpAddress:  [this.incidentData.rpAddress, Validators.required],
        rpAddress2: [this.incidentData.rpAddress2],
        rpCity:  [this.incidentData.rpCity, Validators.required],
        rpState:  [this.incidentData.rpState, Validators.required],
        rpZipcode: [this.incidentData.rpZipcode, Validators.required],
        rpPhone:  [this.incidentData.rpPhone, Validators.required],
        rpEmail:  [this.incidentData.rpEmail, [Validators.email]],
        icFirstName:  [this.incidentData.icFirstName, Validators.required],
        icLastName: [this.incidentData.icLastName, Validators.required],
        icOrganization:  [this.incidentData.icOrganization, Validators.required],
        icAddress:  [this.incidentData.icAddress],
        icAddress2: [this.incidentData.icAddress2],
        icCity:  [this.incidentData.icCity, Validators.required],
        icState:  [this.incidentData.icState, Validators.required],
        icZipcode: [this.incidentData.icZipcode, Validators.required],
        icPhone:  [this.incidentData.icPhone, Validators.required],
        icEmail:  [this.incidentData.icEmail, [Validators.email]],
        groundWater: [{value: this.incidentData.groundWater, disabled: true}],
        surfaceWater:[{value: this.incidentData.surfaceWater, disabled: true}],
        drinkingWater: [{value: this.incidentData.drinkingWater, disabled: true}],
        soil: [{value: this.incidentData.soil, disabled: true}],
        vapor: [{value: this.incidentData.vapor, disabled: true}],
        freeProduct: [{value: this.incidentData.freeProduct, disabled: true}],
        unleadedGas: [{value: this.incidentData.unleadedGas, disabled: true}],
        leadedGas: [{value: this.incidentData.leadedGas, disabled: true}],
        misGas: [{value: this.incidentData.misGas, disabled: true}],
        diesel: [{value: this.incidentData.diesel, disabled: true}],
        wasteOil: [{value: this.incidentData.wasteOil, disabled: true}],
        heatingOil: [{value: this.incidentData.heatingOil, disabled: true}],
        lubricant: [{value: this.incidentData.lubricant, disabled: true}],
        solvent: [{value: this.incidentData.solvent, disabled: true}],
        otherPet: [{value: this.incidentData.otherPet, disabled: true}],
        chemical: [{value: this.incidentData.chemical, disabled: true}],
        unknown: [{value: this.incidentData.unknown, disabled: true}],
        mtbe: [{value: this.incidentData.mtbe, disabled: true}]
      },
      {validator: [IncidentValidators.selectOneOrMoreMedia, IncidentValidators.selectOneOrMoreContaminants] }
    );
    this.resetDate();
  }

  setShowContactInvoice() {
    if (typeof this.incidentForm.controls.releaseType.value !== 'undefined'
    && (this.incidentForm.controls.releaseType.value === 'R' || this.incidentForm.controls.releaseType.value === 'U')) {
      this.showInvoiceContact = true;
    } else {
      this.showInvoiceContact = false;
    }
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
    this.resetForm();
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

  populateTestData(): void {
    this.incidentForm.patchValue({
        dateReported: this.datePipe.transform(new Date(), 'MM-dd-yyyy'),
    reportedBy:  'donald duck',
    reportedByPhone:  '5039999999',
    reportedByEmail: 'a@b.com',
    releaseType:  'R',
    dateReceived: this.datePipe.transform(new Date(), 'MM-dd-yyyy'),
    facilityId: 2,
    siteName:  'Disneyland',
    siteCounty:  '12',
    streetNbr: '12',
    streetQuad:  'W',
    streetName:  'Park',
    streetType: 'Avenue',
    // siteAddress:  ['', Validators.required],
    siteCity:  'Salem',
    siteZipcode: '90099',
    sitePhone: '1231234444',
    company:  'disney',
    initialComment:  'quack quack quack',
    discoveryDate: this.datePipe.transform(new Date(), 'MM-dd-yyyy'),
    confirmationCode: 'CN',
    discoveryCode:  'OT',
    causeCode: 'OT',
    sourceId: '2',
    rpFirstName: 'rpfname',
    rpLastName: 'rplname',
    rpOrganization: 'rporg',
    rpAddress:  'rpAddress',
    rpAddress2: 'rpAddress2',
    rpCity: 'salem',
    rpState:  'OR',
    rpZipcode: '97008',
    rpPhone:  '9999999999',
    rpEmail: 'b@c.com',
    icFirstName:  'icFirstName',
    icLastName: 'iclname',
    icOrganization:  'icOrg',
    icAddress:  'icAddress',
    icAddress2: 'icAddress2',
    icCity:  'Salem',
    icState:  'OR',
    icZipcode: '97224',
    icPhone:  '9098087777',
    icEmail:  'r@v.y',
    // groundWater: 1,
    // surfaceWater: 1,
    // drinkingWater: 1,
    // soil: 1,
    // vapor: 1,
    // freeProduct: 1,
    // unleadedGas: 1,
    // leadedGas: 1,
    // misGas: 1,
    // diesel: 1,
    // wasteOil: 1,
    // heatingOil: 1,
    // lubricant: 1,
    // solvent: 1,
    // otherPet: 1,
    // chemical: 1,
    // unknown: 1,
    // mtbe: 1,
    submitDatetime: new Date()
  });

  this.incidentForm.patchValue({
    dateReceived: this.datePipe.transform(new Date(), 'MM-dd-yyyy')
  });
    // end of populate test data
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
            console.error('********** offending element ===>' + name);
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


}
