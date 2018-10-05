import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { ContactAffilGet } from '../../../models/contact-affil-get';
import { BehaviorSubject, Observable } from 'rxjs';
import { LustDataService } from '../../../services/lust-data.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactsResultDataSourceService implements DataSource<ContactAffilGet> {

  private resultsSubject = new BehaviorSubject<ContactAffilGet[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private contacts: ContactAffilGet[];

  public contactResultReturned$ = this.resultsSubject.asObservable();
  public contactLoading$ = this.loadingSubject.asObservable();

  constructor(private lustDataService: LustDataService) {}

  connect(collectionViewer: CollectionViewer): Observable<ContactAffilGet[]> {
      return this.contactResultReturned$;
      // return this.resultsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.resultsSubject.complete();
      this.loadingSubject.complete();
  }

  loadResults(lustId: number) {
      console.log( JSON.stringify(lustId));
      this.loadingSubject.next(true);
      this.lustDataService.getLustContacts(lustId)
          .pipe(
              finalize(() => this.loadingSubject.next(false)),
          )
          .subscribe(
              data => {
                  this.contacts = data;
                  this.resultsSubject.next(this.contacts);
                  this.loadingSubject.next(false);
              }
          );
  }
}
