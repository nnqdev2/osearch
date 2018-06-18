import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
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

    searchResultReturned$ = this.resultsSubject.asObservable();


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

        console.log('*******loadResults(ustSearchFilter: UstSearchFilter) begins');
        // console.log(ustSearchFilter);
        // console.log( JSON.stringify(ustSearchFilter));

        this.loadingSubject.next(true);

        console.log('*******loadResults(ustSearchFilter: UstSearchFilter) continues');
        this.lustDataService.getUstSearch(ustSearchFilter)
            .pipe(
                finalize(() => this.loadingSubject.next(false)),
            )
            .subscribe(
                data => { this.ustSearchResultStats = data;
                    console.log('*******loadResults(ustSearchFilter: UstSearchFilter)1 inside subscribe');
                    console.log(this.ustSearchResultStats);
                    this.resultsSubject.next(this.ustSearchResultStats);
                    this.loadingSubject.next(false);
                    console.log('*******loadResults(ustSearchFilter: UstSearchFilter)1 inside subscribe done');
                }
            );
    }


    // loadResults(ustSearchFilter: UstSearchFilter) {

    //     this.loadingSubject.next(true);

    //     this.lustDataService.getLustIncidents(ustSearchFilter)
    //         .pipe(
    //             finalize(() => this.loadingSubject.next(false))
    //         )
    //         .subscribe(
    //             data => {
    //                 console.log('**********************');
    //                 console.log(data);
    //                 this.ustSearchResults = data.ustSearchResults;
    //                 this.totalRows = data.totalRows;
    //                 console.log('totalRows====>');
    //                 console.log(this.totalRows);
    //                 this.ustSearchResultStat = new UstSearchResultStat(data.deqOffice, data.incidentStatus
    //                 , data.siteType, data.lustId
    //                 , data.totalRows, data.totalPages, data.pageNumber, data.rowsPerPage, data.sortColumn, data.sortOrder);
    //                 console.log('subscribe..this.ustSearchResults ...........');
    //                 console.log(this.ustSearchResults);
    //                 console.log('subscribe..this.ustSearchResultStat ...........');
    //                 console.log(this.ustSearchResultStat);
    //                 this.resultsSubject.next(this.ustSearchResults);
    //                 this.statSubject.next(this.ustSearchResultStat);
    //             }
    //         );
    // }



}
