import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { ContactSearchResultStat } from '../models/contact-search-result-stat';
import { CollectionViewer } from '@angular/cdk/collections';
import { LustDataService } from '../services/lust-data.service';
import { ContactSearchFilter } from '../models/contact-search-filter';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactSearchResultDataSourceService  implements DataSource<ContactSearchResultStat> {

  private resultsSubject = new BehaviorSubject<ContactSearchResultStat[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private contactSearchResultStats: ContactSearchResultStat[];

  public searchResultReturned$ = this.resultsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private lustDataService: LustDataService) {}

  connect(collectionViewer: CollectionViewer): Observable<ContactSearchResultStat[]> {
      return this.searchResultReturned$;
      // return this.resultsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.resultsSubject.complete();
      this.loadingSubject.complete();
  }

  loadResults(contactSearchFilter: ContactSearchFilter) {
      this.loadingSubject.next(true);
      this.lustDataService.getContacts(contactSearchFilter)
          .pipe(
              finalize(() => this.loadingSubject.next(false)),
          )
          .subscribe(
              data => {
                  this.contactSearchResultStats = data;
                  this.resultsSubject.next(this.contactSearchResultStats);
                  this.loadingSubject.next(false);
              }
          );
  }

}
