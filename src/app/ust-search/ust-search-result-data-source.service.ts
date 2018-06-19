import { Injectable } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { LustDataService } from '../services/lust-data.service';
import { UstSearchResultStat } from '../models/ust-search-result-stat';
import { UstSearchFilter } from '../models/ust-search-filter';

@Injectable({
  providedIn: 'root'
})
export class UstSearchResultDataSourceService implements DataSource<UstSearchResultStat> {

    private resultsSubject = new BehaviorSubject<UstSearchResultStat[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private ustSearchResultStats: UstSearchResultStat[];

    public searchResultReturned$ = this.resultsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();

    constructor(private lustDataService: LustDataService) {}

    connect(collectionViewer: CollectionViewer): Observable<UstSearchResultStat[]> {
        return this.searchResultReturned$;
        // return this.resultsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.resultsSubject.complete();
        this.loadingSubject.complete();
    }

    loadResults(ustSearchFilter: UstSearchFilter) {
        this.loadingSubject.next(true);
        this.lustDataService.getUstSearch(ustSearchFilter)
            .pipe(
                finalize(() => this.loadingSubject.next(false)),
            )
            .subscribe(
                data => {
                    this.ustSearchResultStats = data;
                    this.resultsSubject.next(this.ustSearchResultStats);
                    this.loadingSubject.next(false);
                }
            );
    }

}
