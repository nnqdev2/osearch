import { Injectable } from '@angular/core';
import { Component, ViewChild, ElementRef, Pipe} from '@angular/core';
import { IncidentData } from '../models/incident-data';
import * as jsPDF from 'jspdf';
import { formatNumber, DatePipe, DecimalPipe } from '@angular/common';

import { convertInjectableProviderToFactory } from '@angular/core/src/di/injectable';
import { convertToParamMap } from '@angular/router';
import { INT_TYPE } from '@angular/compiler/src/output/output_ast';
import { LustIncidentUpdate } from '../models/lust-incident';
import { LustIncidentInsertResult } from '../models/lust-incident-insert-result';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  @ViewChild('container') container: ElementRef;
  pipe = new DatePipe('en-US');

  constructor() { }

  createOlprrPdfIncident(lustIncident: LustIncidentUpdate, lustIncidentResult: LustIncidentInsertResult) {

      const SaveFileName: string = lustIncidentResult.logNumberTemp;
      let LogNumber: string;
      LogNumber = lustIncident.countyId.toString();
      while (LogNumber.length < 2) { LogNumber = '0' + LogNumber; }
      const LogYear: any = new Date();
      let LogYearStr: string;
      LogYearStr = this.pipe.transform(Date.now(), 'shortDate').substring(5, 8);
      let LogOlprrId: string;
      LogOlprrId = lustIncident.olprrId.toString();
      while (LogOlprrId.length < 4) { LogOlprrId = '0' + LogOlprrId; }
      const topTemplate = new Image();
      const bottomTemplate = new Image();
      const todaysDate = this.pipe.transform(Date.now(), 'mediumDate');
      topTemplate.src = './assets/images/NWRTemplateTop.JPG';
      bottomTemplate.src = './assets/images/NWRTemplateBottom.JPG';
      
      


      const doc = new jsPDF('landscape');
      doc.setFontSize(10);
      doc.setDrawColor('Black');
      doc.setFont('Courier');
      doc.text([todaysDate], 105, 10);
      doc.text([lustIncident.rpFirstName.toUpperCase()] + ' ' + [lustIncident.rpLastName.toUpperCase()], 20, 25);
      doc.text([lustIncident.rpAddress], 20, 30);
      doc.text([lustIncident.rpCity] + ' ' + [lustIncident.rpState] + ', ' + [lustIncident.rpZipcode] , 20, 35);
      doc.text('RE: ' + [lustIncident.siteName], 120, 40);
      // doc.text('File No: ' + LogNumber + '-' + LogYearStr.toString() + '-' + LogOlprrId, 120, 45);
      doc.text('File No: ' + lustIncidentResult.logNumberTemp, 120, 45);
      doc.text('A release was reported from an underground heating oil tank (HOT) system located at ' 
              + [lustIncident.rpAddress] + ', in', 20, 55);
      doc.text([lustIncident.rpCity.toUpperCase()] + ', '
              + [lustIncident.rpState] + '.  As the responsible party for the property, you are required to clean', 20, 60);
      doc.text('up the heating oil release according to Oregon Administration Rules (OAR) OAR 340-177-0001', 20, 65);
      doc.text('through OAR 340-177-0095.  These rules require cleaning up the soil, groundwater, surface', 20, 75);
      doc.text('water, soil vapor, and any other media contaminated by heating oil to the appropriate standards or', 20, 80);
      doc.text('demonstrating that the contamination does not pose a risk to human health or the environment', 20, 85);
      doc.addImage(topTemplate.src, 'JPEG', 15, 90, 250, 120);
      doc.addPage();
      doc.addImage(bottomTemplate.src, 'JPEG', 15, 10, 250, 120);
      doc.save(SaveFileName + '-NWR.PDF');
      // doc.output(environment.olprr_PDF_output_location);

  }

  printFromPDF(SiteName: string): void  {
      const doc = new jsPDF();
      // tslint:disable-next-line:no-unused-expression
      document.readyState;
      const myElement = document.getElementById('print-section');
      doc.fromHTML(myElement, 20, 20, { 'width': 500});
      doc.save('testhtml.pdf');
  }
}
