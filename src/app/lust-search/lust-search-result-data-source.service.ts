import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { LustDataService } from '../services/lust-data.service';
import { LustSearchResultStat } from '../models/lust-search-result-stat';
import { LustSearchFilter } from '../models/lust-search-filter';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LustSearchResultDataSourceService implements DataSource<LustSearchResultStat> {

    private resultsSubject = new BehaviorSubject<LustSearchResultStat[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private lustSearchResultStats: LustSearchResultStat[];

    searchResultReturned$ = this.resultsSubject.asObservable();


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

        console.log('*******loadResults(lustSearchFilter: LustSearchFilter) begins');
        console.log(lustSearchFilter);
        console.log( JSON.stringify(lustSearchFilter));

        this.loadingSubject.next(true);

        this.lustDataService.getLustSearch(lustSearchFilter)
            .pipe(
                finalize(() => this.loadingSubject.next(false)),
            )
            .subscribe(
                data => { this.lustSearchResultStats = data;
                    console.log('*******loadResults(lustSearchFilter: LustSearchFilter)1 inside subscribe');
                    console.log(this.lustSearchResultStats);
                    this.resultsSubject.next(this.lustSearchResultStats);
                    this.loadingSubject.next(false);
                    console.log('*******loadResults(lustSearchFilter: LustSearchFilter)1 inside subscribe done');
                }
            );
    }


    // loadResults(lustSearchFilter: LustSearchFilter) {

    //     this.loadingSubject.next(true);

    //     this.lustDataService.getLustIncidents(lustSearchFilter)
    //         .pipe(
    //             finalize(() => this.loadingSubject.next(false))
    //         )
    //         .subscribe(
    //             data => {
    //                 console.log('**********************');
    //                 console.log(data);
    //                 this.lustSearchResults = data.lustSearchResults;
    //                 this.totalRows = data.totalRows;
    //                 console.log('totalRows====>');
    //                 console.log(this.totalRows);
    //                 this.lustSearchResultStat = new LustSearchResultStat(data.deqOffice, data.incidentStatus
    //                 , data.siteType, data.lustId
    //                 , data.totalRows, data.totalPages, data.pageNumber, data.rowsPerPage, data.sortColumn, data.sortOrder);
    //                 console.log('subscribe..this.lustSearchResults ...........');
    //                 console.log(this.lustSearchResults);
    //                 console.log('subscribe..this.lustSearchResultStat ...........');
    //                 console.log(this.lustSearchResultStat);
    //                 this.resultsSubject.next(this.lustSearchResults);
    //                 this.statSubject.next(this.lustSearchResultStat);
    //             }
    //         );
    // }



}
