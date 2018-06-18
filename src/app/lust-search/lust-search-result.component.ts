import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatPaginator, MatSort, MatSortHeader } from '@angular/material';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription, fromEvent, merge } from 'rxjs';

import { LustSearchResultDataSourceService } from './lust-search-result-data-source.service';
import { LustSearchFilter } from '../models/lust-search-filter';
import { LustSearchResultStat } from '../models/lust-search-result-stat';
import { LustDataService } from '../services/lust-data.service';

@Component({
  selector: 'app-lust-search-result',
  templateUrl: './lust-search-result.component.html',
  styleUrls: ['./lust-search-result.component.scss']
})
export class LustSearchResultComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {

  @Input() lustSearchFilter: LustSearchFilter;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  dataSource: LustSearchResultDataSourceService;
  displayedColumns = ['logNumber', 'siteName', 'siteAddress', 'firDt', 'closedDt'
                    , 'facilityId', 'siteScore'];

  subscription: Subscription;
  lustSearchResultStats: LustSearchResultStat[];
  totalTotal = 3000;

  constructor(private lustDataService: LustDataService, private route: ActivatedRoute, private router: Router) {
    this.dataSource = new LustSearchResultDataSourceService(this.lustDataService);
  }


  ngOnChanges(changes: SimpleChanges) {
    console.log('****ngOnChanges');
    console.log(changes);
    console.log(this.lustSearchFilter);
    this.loadResultPage();
  }

  ngOnInit() {
    console.log('ngOnInit() this.lustSearchFilter');
    console.log(this.lustSearchFilter);
    // this.dataSource = new LustSearchResultsDataSource(this.lustDataService);
    // this.dataSource.loadResults(this.lustSearchFilter);
  }

  ngAfterViewInit() {
    console.log('######################################ngAfterViewInit() this.lustSearchFilter');
    console.log(this.lustSearchFilter);

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadResultPage())
    )
    .subscribe();
  }

  loadResultPage() {
    console.log('loadResultPage() this.lustSearchFilter filter before');
    console.log(this.lustSearchFilter);
    this.lustSearchFilter.pageNumber = this.paginator.pageIndex + 1;
    this.lustSearchFilter.rowsPerPage = ((this.paginator.pageSize === 0 || this.paginator.pageSize === undefined)
          ? 40 : this.paginator.pageSize);
    this.lustSearchFilter.sortColumn = (this.sort.active === undefined ? 1 : this.getSortCol(this.sort.active));
    this.lustSearchFilter.sortOrder = this.getSortOrder(this.sort.direction);

    console.log('loadResultPage() this.lustSearchFilter filter after');
    console.log(this.lustSearchFilter);
    this.dataSource.loadResults(this.lustSearchFilter);
  }

  private getSortCol(colName: string): number {
    switch (colName) {
      case 'lustId':
        return 1;
      case 'logNumber':
        return 2;
      case 'siteName':
        return 3;
      case 'siteAddress':
        return 4;
      case 'firDt':
        return 5;
      case 'closedDt':
        return 6;
      case 'facilityId':
        return 7;
      case 'siteScore':
        return 8;
      default:
        return 1;
    }
  }

  private getSortOrder(sortDirection: string): number {
    switch (sortDirection) {
      case 'asc':
        return 1;
      case 'desc':
        return -1;
      default:
        return 1;
    }
  }

  getSearchResults() {
    this.subscription = this.dataSource.searchResultReturned$.subscribe(
      lustSearchResultStats => {
        this.lustSearchResultStats = lustSearchResultStats;
    });
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  // onRowClicked(lustId: string) {
  //   this.router.navigate(['review/', +lustId]);
  // }
}


