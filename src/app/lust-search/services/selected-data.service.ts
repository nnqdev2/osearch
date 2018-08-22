import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ContactSearchResultStat } from '../../models/contact-search-result-stat';
import { UstSearchResultStat } from '../../models/ust-search-result-stat';

@Injectable({
  providedIn: 'root'
})
export class SelectedDataService {
  private contactData = new BehaviorSubject<ContactSearchResultStat>(null);
  private icData = new BehaviorSubject<ContactSearchResultStat>(null);
  private rpData = new BehaviorSubject<ContactSearchResultStat>(null);
  private ustData = new BehaviorSubject<UstSearchResultStat>(null);

  contactDataSelected$ = this.contactData.asObservable();
  icDataSelected$ = this.icData.asObservable();
  rpDataSelected$ = this.rpData.asObservable();
  ustDataSelected$ = this.ustData.asObservable();

  selectedContactData(contactSearchResultStat: ContactSearchResultStat) {
    console.log('**** selectedContactData(contactSearchResultStat: ContactSearchResultStat) ');
    console.log(contactSearchResultStat);
    this.icData.next(contactSearchResultStat);
  }
  selectedIcData(contactSearchResultStat: ContactSearchResultStat) {
    console.log('**** selectedIcData(contactSearchResultStat: ContactSearchResultStat) ');
    console.log(contactSearchResultStat);
    this.icData.next(contactSearchResultStat);
  }
  selectedRpData(contactSearchResultStat: ContactSearchResultStat) {
    console.log('**** selectedRpData(contactSearchResultStat: ContactSearchResultStat) ');
    console.log(contactSearchResultStat);
    this.rpData.next(contactSearchResultStat);
  }
  selectedUstData(ustSearchResultStat: UstSearchResultStat) {
    console.log('**** selectedUstData(ustSearchResultStat: UstSearchResultStat) ');
    console.log(ustSearchResultStat);
    this.ustData.next(ustSearchResultStat);
  }
}
