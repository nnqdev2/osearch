import { Component, OnInit, AfterViewInit, OnChanges, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { SiteAliasResultDataSourceService } from './site-alias-result-data-source.service';
import { Subscription } from 'rxjs';
import { SiteAlias } from '../../models/site-alias';
import { LustDataService } from '../../services/lust-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-site-alias',
  templateUrl: './site-alias.component.html',
  styleUrls: ['./site-alias.component.scss']
})
export class SiteAliasComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input() lustId: number;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;


  dataSource: SiteAliasResultDataSourceService;
  displayedColumns = ['logNumber', 'siteName', 'siteAddress', 'firDt', 'closedDt'
                    , 'facilityId', 'siteScore'];

  subscription: Subscription;
  siteAliases: SiteAlias[];
  totalRows = 0;

  constructor(private lustDataService: LustDataService, private route: ActivatedRoute, private router: Router) {
    this.dataSource = new SiteAliasResultDataSourceService(this.lustDataService);
  }
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadResultPage();
    this.getSearchResults();
  }

  ngAfterViewInit() {
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    // merge(this.sort.sortChange, this.paginator.page)
    // .pipe(
    //     tap(() => this.loadResultPage())
    // )
    // .subscribe();
  }

  loadResultPage() {
    // this.lustSearchFilter.pageNumber = this.paginator.pageIndex + 1;
    // this.lustSearchFilter.rowsPerPage = ((this.paginator.pageSize === 0 || this.paginator.pageSize === undefined)
    //       ? 40 : this.paginator.pageSize);
    // this.lustSearchFilter.sortColumn = (this.sort.active === undefined ? 1 : this.getSortCol(this.sort.active));
    // this.lustSearchFilter.sortOrder = this.getSortOrder(this.sort.direction);
    this.dataSource.loadResults(this.lustId);
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
      siteAliases => {
        this.siteAliases = siteAliases;
        if (this.siteAliases !== undefined &&
          this.siteAliases.length > 0) {
            this.totalRows = this.siteAliases.length;
        } else {
          this.totalRows = 0;
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onRowClicked(lustId: string) {
  // //   this.router.navigate(['review/', +lustId]);
  }
}

