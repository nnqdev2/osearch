import { Injectable } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { LustDataService } from '../../services/lust-data.service';
import { LustSearchResultStat } from '../../models/lust-search-result-stat';
import { LustSearchFilter } from '../../models/lust-search-filter';

@Injectable({
  providedIn: 'root'
})
export class LustSearchResultDataSourceService implements DataSource<LustSearchResultStat> {

    private resultsSubject = new BehaviorSubject<LustSearchResultStat[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private lustSearchResultStats: LustSearchResultStat[];

    public searchResultReturned$ = this.resultsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();

    constructor(private lustDataService: LustDataService) {}

    connect(collectionViewer: CollectionViewer): Observable<LustSearchResultStat[]> {
        return this.searchResultReturned$;
        // return this.resultsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.resultsSubject.complete();
        this.loadingSubject.complete();
    }

    loadResults(lustSearchFilter: LustSearchFilter) {
        console.log( JSON.stringify(lustSearchFilter));
        this.loadingSubject.next(true);
        this.lustDataService.getLustSearch(lustSearchFilter)
            .pipe(
                finalize(() => this.loadingSubject.next(false)),
            )
            .subscribe(
                data => {
                    this.lustSearchResultStats = data;
                    this.resultsSubject.next(this.lustSearchResultStats);
                    this.loadingSubject.next(false);
                }
            );
    }
}
