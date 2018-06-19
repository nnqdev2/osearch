import { Injectable } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { LustDataService } from '../services/lust-data.service';
import { OlprrSearchResultStat } from '../models/olprr-search-result-stat';
import { OlprrSearchFilter } from '../models/olprr-search-filter';

@Injectable({
    providedIn: 'root'
})
export class OlprrSearchResultsDataSource implements DataSource<OlprrSearchResultStat> {

    private resultsSubject = new BehaviorSubject<OlprrSearchResultStat[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private olprrSearchResultStats: OlprrSearchResultStat[];

    public searchResultReturned$ = this.resultsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();

    constructor(private lustDataService: LustDataService) {}

    connect(collectionViewer: CollectionViewer): Observable<OlprrSearchResultStat[]> {
        return this.searchResultReturned$;
        // return this.resultsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.resultsSubject.complete();
        this.loadingSubject.complete();
    }

    loadIncidents(olprrSearchFilter: OlprrSearchFilter) {
        // console.log( JSON.stringify(olprrSearchFilter));
        this.loadingSubject.next(true);
        this.lustDataService.getOlprrIncidents(olprrSearchFilter)
            .pipe(
                finalize(() => this.loadingSubject.next(false)),
            )
            .subscribe(
                data => {
                    this.olprrSearchResultStats = data;
                    this.resultsSubject.next(this.olprrSearchResultStats);
                    this.loadingSubject.next(false);
                }
            );
    }
}
