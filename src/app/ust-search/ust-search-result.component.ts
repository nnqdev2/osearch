import { Component, Input, AfterViewInit, ViewChild, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatPaginator, MatSort, MatSortHeader } from '@angular/material';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription, fromEvent, merge } from 'rxjs';

import { UstSearchResultDataSourceService } from './ust-search-result-data-source.service';
import { UstSearchFilter } from '../models/ust-search-filter';
import { UstSearchResultStat } from '../models/ust-search-result-stat';
import { LustDataService } from '../services/lust-data.service';

@Component({
  selector: 'app-ust-search-result',
  templateUrl: './ust-search-result.component.html',
  styleUrls: ['./ust-search-result.component.scss']
})
export class UstSearchResultComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() ustSearchFilter: UstSearchFilter;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: UstSearchResultDataSourceService;
  displayedColumns = ['facilityId', 'facilityName', 'facilityAddress', 'facilityCity', 'facilityZip'];

  subscription: Subscription;
  ustSearchResultStats: UstSearchResultStat[];
  totalRows = 0;

  constructor(private lustDataService: LustDataService, private route: ActivatedRoute, private router: Router) {
    this.dataSource = new UstSearchResultDataSourceService(this.lustDataService);
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
    this.ustSearchFilter.pageNumber = this.paginator.pageIndex + 1;
    this.ustSearchFilter.rowsPerPage = ((this.paginator.pageSize === 0 || this.paginator.pageSize === undefined)
          ? 40 : this.paginator.pageSize);
    this.ustSearchFilter.sortColumn = (this.sort.active === undefined ? 1 : this.getSortCol(this.sort.active));
    this.ustSearchFilter.sortOrder = this.getSortOrder(this.sort.direction);
    this.dataSource.loadResults(this.ustSearchFilter);
  }

  private getSortCol(colName: string): number {
    switch (colName) {
      case 'facilityId':
        return 0;
      case 'facilityName':
        return 1;
      case 'facililtyAddress':
        return 2;
      case 'facilityCity':
        return 3;
      case 'facilityZip':
        return 4;
      default:
        return 0;
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
      ustSearchResultStats => {
        this.ustSearchResultStats = ustSearchResultStats;
        if (this.ustSearchResultStats !== undefined &&
        this.ustSearchResultStats.length > 0) {
          this.totalRows = this.ustSearchResultStats[0].totalRows;
        } else {
          this.totalRows = 0;
        }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // onRowClicked(lustId: string) {
  //   this.router.navigate(['review/', +lustId]);
  // }
}
