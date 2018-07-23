import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { IdToNameService } from './id-to-name.service';


@Component({
  selector: 'app-incident',
  templateUrl: './olprr-incident.component.html',
  styleUrls: ['./olprr-incident.component.scss'],
  providers: [ DatePipe, LustDataService, IdToNameService ]
})
export class OlprrIncidentComponent implements OnInit {

  incident: Incident = new Incident();
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
  maxDate: Date;
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
    , private configService: ConfigService, private idToNameService: IdToNameService, private route: ActivatedRoute
    , private router: Router) {}


  ngOnInit() {
    this.route.data.subscribe((data: {siteTypes: SiteType[]}) => {this.siteTypes = data.siteTypes; });
    this.route.data.subscribe((data: {confirmationTypes: ConfirmationType[]}) => {this.confirmationTypes = data.confirmationTypes; });
    this.route.data.subscribe((data: {counties: County[]}) => {this.counties = data.counties; });
    this.route.data.subscribe((data: {discoveryTypes: DiscoveryType[]}) => {this.discoveryTypes = data.discoveryTypes; });
    this.route.data.subscribe((data: {quadrants: Quadrant[]}) => {this.quadrants = data.quadrants; });
    this.route.data.subscribe((data: {releaseCauseTypes: ReleaseCauseType[]}) => {this.releaseCauseTypes = data.releaseCauseTypes; });
    this.route.data.subscribe((data: {sourceTypes: SourceType[]}) => {this.sourceTypes = data.sourceTypes; });
    this.route.data.subscribe((data: {states: State[]}) => {this.states = data.states; });
    this.route.data.subscribe((data: {streetTypes: StreetType[]}) => {this.streetTypes = data.streetTypes; });
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
        dateReceived:  [{value: '', disabled: true},  Validators.required],
        facilityId: ['', Validators.pattern('^([+-]?[1-9]\\d*|0)$')],
        siteName:  [{value: '', disabled: false}, Validators.compose([Validators.required, Validators.maxLength(40)])],
        siteCounty:  ['', Validators.required],
        streetNbr: ['', Validators.compose([Validators.required, Validators.maxLength(11)])],
        streetQuad:  ['', Validators.compose([Validators.required, Validators.maxLength(2)])],
        streetName:  ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
        streetType: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
        siteAddress:  ['', Validators.compose([Validators.maxLength(40)])],
        siteCity:  ['', Validators.compose([Validators.required, Validators.maxLength(25)])],
        siteZipcode: ['', Validators.compose([Validators.required, Validators.maxLength(10)
          , Validators.pattern('^(?!0{5})\\d{5}(?:[-\s]\\d{4})?')])],
        sitePhone:  ['', Validators.compose([Validators.maxLength(25)])],
        company:  ['', Validators.required],
        initialComment:  ['', Validators.maxLength(710)],
        discoveryDate: [{value: ''}, Validators.compose([Validators.required])],
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
      {validator: [IncidentValidators.selectOneOrMoreMedia, IncidentValidators.selectOneOrMoreContaminants] }
    );
    this.resetDate();
  }

  setShowContactInvoiceAndFacilityId() {
    this.incidentForm.controls.releaseType.valueChanges.subscribe(data => {
      if (data === 'R' || data === 'U') {
        this.showInvoiceContact = true;
      } else {
        this.showInvoiceContact = false;
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
    console.log('*********createIncident() 1111   ');
    this.incidentForm.controls.deqOffice.setValue(this.getDeqOffice());
    console.log('*********createIncident() 2222   ');
    this.incidentForm.controls.contractorUid.setValue(environment.contractor_uid);
    this.incidentForm.controls.contractorPwd.setValue(environment.contractor_pwd);
    console.log('*********createIncident() 3333   ');
    this.incidentForm.controls.siteAddress.setValue(`${this.incidentForm.controls.streetNbr.value} `
      + `${this.incidentForm.controls.streetQuad.value} `
      + `${this.incidentForm.controls.streetName.value} `
      + `${this.incidentForm.controls.streetType.value} `);
    const ngbDate = this.incidentForm.controls['discoveryDate'].value;
    const myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    // this.incidentForm.controls['discoveryDate'].setValue(myDate);
    this.incidentForm.controls['submitDateTime'].setValue(myDate);
    this.incident.dateReceived = (this.incidentForm.controls.dateReceived.value);

    console.log('*********this.incidentForm is ');
    console.log(this.incidentForm.value);
    console.log('*********this.incident is ' );
    console.log( JSON.stringify(this.incident));

    // Copy the form values over the product object values
    const p = Object.assign({}, this.incident, this.incidentForm.value);

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
    this.incidentForm.patchValue({
      dateReceived: this.datePipe.transform(new Date(), 'MM-dd-yyyy')
    });
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

  transformDate(date) {
    this.datePipe.transform(date, 'yyyy-MM-dd');
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
            console.log('**********HELLLOOOO????');
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

    DateValidator() {

    }

}
