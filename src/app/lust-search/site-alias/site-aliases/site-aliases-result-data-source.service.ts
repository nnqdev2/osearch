import { Injectable } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { LustDataService } from '../../../services/lust-data.service';
import { SiteAlias } from '../../../models/site-alias';

@Injectable({
  providedIn: 'root'
})
export class SiteAliasesResultDataSourceService implements DataSource<SiteAlias> {

  private resultsSubject = new BehaviorSubject<SiteAlias[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private siteAliases: SiteAlias[];

  public siteAliasResultReturned$ = this.resultsSubject.asObservable();
  public siteAliasLoading$ = this.loadingSubject.asObservable();

  constructor(private lustDataService: LustDataService) {}

  connect(collectionViewer: CollectionViewer): Observable<SiteAlias[]> {
      return this.siteAliasResultReturned$;
      // return this.resultsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.resultsSubject.complete();
      this.loadingSubject.complete();
  }

  loadResults(lustId: number) {
      console.log( JSON.stringify(lustId));
      this.loadingSubject.next(true);
      this.lustDataService.getSiteAliases(lustId)
          .pipe(
              finalize(() => this.loadingSubject.next(false)),
          )
          .subscribe(
              data => {
                  this.siteAliases = data;
                  this.resultsSubject.next(this.siteAliases);
                  this.loadingSubject.next(false);
              }
          );
  }
}
