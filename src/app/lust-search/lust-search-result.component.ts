import { Component, Input, AfterViewInit, ViewChild, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatPaginator, MatSort, MatSortHeader } from '@angular/material';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription, fromEvent, merge } from 'rxjs';

import { LustSearchResultDataSourceService } from './lust-search-result-data-source.service';
import { LustSearchFilter } from '../models/lust-search-filter';
import { LustSearchResultStat } from '../models/lust-search-result-stat';
import { LustDataService } from '../services/lust-data.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-lust-search-result',
  templateUrl: './lust-search-result.component.html',
  styleUrls: ['./lust-search-result.component.scss']
})
export class LustSearchResultComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() lustSearchFilter: LustSearchFilter;
  @Input() isSearchOnly: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: LustSearchResultDataSourceService;
  displayedColumns = [ 'reqPageNumber', 'logNumber', 'siteName', 'siteAddress', 'firDt', 'closedDt'
                    , 'facilityId', 'siteScore'];

  subscription: Subscription;
  lustSearchResultStats: LustSearchResultStat[];
  totalRows = 0;

  constructor(private lustDataService: LustDataService, private route: ActivatedRoute, private router: Router) {
    this.dataSource = new LustSearchResultDataSourceService(this.lustDataService);
  }


  ngOnChanges(changes: SimpleChanges) {
    this.loadResultPage();
    this.getSearchResults();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadResultPage())
    )
    .subscribe();
  }

  loadResultPage() {
    this.lustSearchFilter.pageNumber = this.paginator.pageIndex + 1;
    this.lustSearchFilter.rowsPerPage = ((this.paginator.pageSize === 0 || this.paginator.pageSize === undefined)
          ? 40 : this.paginator.pageSize);
    this.lustSearchFilter.sortColumn = (this.sort.active === undefined ? 1 : this.getSortCol(this.sort.active));
    this.lustSearchFilter.sortOrder = this.getSortOrder(this.sort.direction);
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
        if (this.lustSearchResultStats !== undefined &&
          this.lustSearchResultStats.length > 0) {
            this.totalRows = this.lustSearchResultStats[0].totalRows;
        } else {
          this.totalRows = 0;
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onRowClicked(lustSearchResultStat: LustSearchResultStat) {
    if (!this.isSearchOnly) {
      this.router.navigate(['lust', lustSearchResultStat.lustId]);
    }
  }


}


