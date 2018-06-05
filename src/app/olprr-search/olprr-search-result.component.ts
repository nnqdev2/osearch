import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges, SimpleChanges, OnDestroy, ElementRef } from '@angular/core';
import { LustDataService } from '../service/lust-data.service';
import { OlprrSearchResultsDataSource } from './olprr-search-results-data-source';
import { OlprrSearchFilter } from '../models/olprr-search-filter';
import { MatPaginator, MatSort, MatSortHeader } from '@angular/material';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription, fromEvent, merge } from 'rxjs';
import { OlprrSearchResultStats } from '../models/olprr-search-result-stat';

@Component({
  selector: 'app-olprr-search-result',
  templateUrl: './olprr-search-result.component.html',
  styleUrls: ['./olprr-search-result.component.scss']
})
export class OlprrSearchResultComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {


  @Input() olprrSearchFilter: OlprrSearchFilter;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('sortColName') sortColName: ElementRef;


  dataSource: OlprrSearchResultsDataSource;
  // displayedColumns = ['olprrId', 'dateReceived', 'siteName'];
  displayedColumns = ['olprrId', 'siteStatus', 'releaseType', 'receivedDate', 'siteName', 'siteAddress', 'siteCounty', 'reportedBy'];

  subscription: Subscription;
  olprrSearchResultStats: OlprrSearchResultStats[];
  totalTotal = 300;

  constructor(private lustDataService: LustDataService) {
    console.log('constructor() this.olprrSearchFilter');
    console.log(this.olprrSearchFilter);
    this.dataSource = new OlprrSearchResultsDataSource(this.lustDataService);
  }

  ngOnChanges(changes: SimpleChanges) {

    console.log('****ngOnChanges');
    console.log(changes);
    console.log(this.olprrSearchFilter);

    console.log('ngOnChanges(changes: SimpleChanges) this.sort');
    console.log(this.sort);

    console.log('ngOnChanges(changes: SimpleChanges) this.sort.active');
    console.log(this.sort.active);

    console.log('ngOnChanges(changes: SimpleChanges) this.sort.direction');
    console.log(this.sort.direction);

    this.loadIncidentsPage();
    // merge(this.sort.sortChange, this.paginator.page)
    // .pipe(
    //     tap(() => this.loadIncidentsPage())
    // )
    // .subscribe();
    // this.dataSource.loadIncidents(this.olprrSearchFilter);
    console.log('****ngOnChanges done');

    // if (changes.myNum && !changes.myNum.isFirstChange()) {
    //   // exteranl API call or more preprocessing...
    // }

    // for (let propName in changes) {
    //   const change = changes[propName];
    //   console.dir(change);
    //   if (change.isFirstChange()) {
    //     console.log(`first change: ${propName}`);
    //   } else {
    //     console.log(`prev: ${change.previousValue}, cur: ${change.currentValue}`);
    //   }
    // }
  }

  ngOnInit() {
    console.log('ngOnInit() this.olprrSearchFilter');
    console.log(this.olprrSearchFilter);
    // this.dataSource = new OlprrSearchResultsDataSource(this.lustDataService);
    // this.dataSource.loadIncidents(this.olprrSearchFilter);
  }

  ngAfterViewInit() {
    console.log('######################################ngAfterViewInit() this.olprrSearchFilter');
    console.log(this.olprrSearchFilter);

    console.log('ngAfterViewInit() this.sort');
    console.log(this.sort);

    console.log('ngAfterViewInit() this.sort.active');
    console.log(this.sort.active);

    console.log('ngAfterViewInit() this.sort.direction');
    console.log(this.sort.direction);

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // if (this.sortColName !== undefined) {
    //   fromEvent(this.sortColName.nativeElement, 'keyup')
    //       .pipe(
    //           debounceTime(150),
    //           distinctUntilChanged(),
    //           tap(() => {
    //               this.paginator.pageIndex = 0;
    //               this.loadIncidentsPage();
    //           })
    //       )
    //       .subscribe();
    //   fromEvent(this.sortColName.nativeElement, 'keydown')
    //       .pipe(
    //           debounceTime(150),
    //           distinctUntilChanged(),
    //           tap(() => {
    //               this.paginator.pageIndex = 0;
    //               this.loadIncidentsPage();
    //           })
    //       )
    //       .subscribe();
    // }

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadIncidentsPage())
    )
    .subscribe();



    // this.paginator.page
    //     .pipe(
    //         tap(() => this.loadIncidentsPage())
    //     )
    //     .subscribe();
  }

  loadIncidentsPage() {
    console.log('loadIncidentsPage() this.olprrSearchFilter filter before');
    console.log(this.olprrSearchFilter);
    this.olprrSearchFilter.pageNumber = this.paginator.pageIndex + 1;
    this.olprrSearchFilter.rowsPerPage = ((this.paginator.pageSize === 0 || this.paginator.pageSize === undefined)
     ? 40 : this.paginator.pageSize);

    this.olprrSearchFilter.sortColumn = (this.sort.active === undefined ? 1 : this.getSortCol(this.sort.active));


    this.olprrSearchFilter.sortOrder = this.getSortOrder(this.sort.direction);

    console.log('loadIncidentsPage() this.olprrSearchFilter filter after');
    console.log(this.olprrSearchFilter);
    this.dataSource.loadIncidents(this.olprrSearchFilter);
  }
  // loadIncidentsPage() {
  //   this.dataSource.loadIncidents(
  //       this.course.id,
  //       '',
  //       'asc',
  //       this.paginator.pageIndex,
  //       this.paginator.pageSize);
  // }

  private getSortCol(colName: string): number {
    console.log('#################getSortCol(colName: string): number ');
    console.log(colName);
    switch (colName) {
      case 'releaseType':
        return 1;
      case 'siteName':
        return 2;
      case 'siteAddress':
        return 3;
      case 'siteStatus':
        return 5;
      case 'reportedBy':
        return 6;
      case 'siteCounty':
        return 8;
      case 'receivedDate':
        return 9;
      default:
        return 1;
    }
  }

  private getSortOrder(sortDirection: string): number {
    console.log('#################getSortOrder(sortDirection: string): number ');
    console.log(sortDirection);
    switch (sortDirection) {
      case 'asc':
        return 1;
      case 'desc':
        return -1;
      default:
        return 1;
    }
  }

  onRowClicked(row: OlprrSearchResultStats) {
    console.log('*****onRowClicked(row: OlprrSearchResultStats)');
    console.log(row);
  }

  getSearchResults() {
    console.log('****SearchResultsComponent  getLustSearchResults()  ******');
    this.subscription = this.dataSource.searchResultReturned$.subscribe(
      olprrSearchResultStats => {
        console.log('$$$$$$$$$*****getSearchResults()');
        console.log(this.olprrSearchResultStats);
        this.olprrSearchResultStats = olprrSearchResultStats;
    });
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}


