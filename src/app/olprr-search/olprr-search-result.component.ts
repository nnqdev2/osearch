import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { OlprrSearchResultsDataSource } from './olprr-search-results-data-source';
import { OlprrSearchFilter } from '../models/olprr-search-filter';
import { MatPaginator, MatSort, MatSortHeader } from '@angular/material';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription, fromEvent, merge } from 'rxjs';
import { OlprrSearchResultStats } from '../models/olprr-search-result-stat';

@Component({
  selector: 'app-olprr-search-result',
  templateUrl: './olprr-search-result.component.html',
  styleUrls: ['./olprr-search-result.component.scss'],
  providers: [OlprrSearchResultsDataSource]
})
export class OlprrSearchResultComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {


  @Input() olprrSearchFilter: OlprrSearchFilter;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  // dataSource: OlprrSearchResultsDataSource;
  displayedColumns = ['olprrId', 'siteStatus', 'releaseType', 'receiveDate', 'siteName'
                    , 'siteAddress', 'siteCounty', 'reportedBy', 'siteComment'];

  subscription: Subscription;
  olprrSearchResultStats: OlprrSearchResultStats[];
  totalTotal = 300;

  constructor(private dataSource: OlprrSearchResultsDataSource) { }


  ngOnChanges(changes: SimpleChanges) {

    console.log('****ngOnChanges');
    console.log(changes);
    console.log(this.olprrSearchFilter);

    this.loadIncidentsPage();

    console.log('****ngOnChanges done');
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

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadIncidentsPage())
    )
    .subscribe();
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
      case 'receiveDate':
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


