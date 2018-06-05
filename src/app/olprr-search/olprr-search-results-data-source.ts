import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { LustDataService } from '../service/lust-data.service';
import { OlprrSearchResultWithStats } from '../models/olprr-search-results-with-stats';
import { OlprrSearchResult } from '../models/olprr-search-result';
import { OlprrSearchResultStats } from '../models/olprr-search-result-stat';
import { OlprrSearchFilter } from '../models/olprr-search-filter';
import { Injectable } from '@angular/core';

@Injectable()
export class OlprrSearchResultsDataSource implements DataSource<OlprrSearchResultStats> {

    private resultsSubject = new BehaviorSubject<OlprrSearchResultStats[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private olprrSearchResultStats: OlprrSearchResultStats[];

    searchResultReturned$ = this.resultsSubject.asObservable();


    public loading$ = this.loadingSubject.asObservable();

    constructor(private lustDataService: LustDataService) {}

    connect(collectionViewer: CollectionViewer): Observable<OlprrSearchResult[]> {
        return this.searchResultReturned$;
        // return this.resultsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.resultsSubject.complete();
        this.loadingSubject.complete();
    }

    loadIncidents(olprrSearchFilter: OlprrSearchFilter) {

        console.log('*******loadIncidents(olprrSearchFilter: OlprrSearchFilter) begins');
        console.log(olprrSearchFilter);

        this.loadingSubject.next(true);

        this.lustDataService.getOlprrIncidents(olprrSearchFilter)
            .pipe(
                finalize(() => this.loadingSubject.next(false)),
            )
            .subscribe(
                data => { this.olprrSearchResultStats = data;
                    console.log('*******loadIncidents(olprrSearchFilter: OlprrSearchFilter)1 inside subscribe');
                    console.log(this.olprrSearchResultStats);
                    this.resultsSubject.next(this.olprrSearchResultStats);
                    this.loadingSubject.next(false);
                }
            );
    }


    // loadIncidents(olprrSearchFilter: OlprrSearchFilter) {

    //     this.loadingSubject.next(true);

    //     this.lustDataService.getOlprrIncidents(olprrSearchFilter)
    //         .pipe(
    //             finalize(() => this.loadingSubject.next(false))
    //         )
    //         .subscribe(
    //             data => {
    //                 console.log('**********************');
    //                 console.log(data);
    //                 this.olprrSearchResults = data.olprrSearchResults;
    //                 this.totalRows = data.totalRows;
    //                 console.log('totalRows====>');
    //                 console.log(this.totalRows);
    //                 this.olprrSearchResultStat = new OlprrSearchResultStat(data.deqOffice, data.incidentStatus
    //                 , data.siteType, data.olprrId
    //                 , data.totalRows, data.totalPages, data.pageNumber, data.rowsPerPage, data.sortColumn, data.sortOrder);
    //                 console.log('subscribe..this.olprrSearchResults ...........');
    //                 console.log(this.olprrSearchResults);
    //                 console.log('subscribe..this.olprrSearchResultStat ...........');
    //                 console.log(this.olprrSearchResultStat);
    //                 this.resultsSubject.next(this.olprrSearchResults);
    //                 this.statSubject.next(this.olprrSearchResultStat);
    //             }
    //         );
    // }



}
