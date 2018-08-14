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

  lustId: number;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;


  siteAliasDataSource: SiteAliasResultDataSourceService;
  displayedColumns = ['logNumber', 'siteName', 'siteAddress', 'firDt', 'closedDt'
                    , 'facilityId', 'siteScore'];

  subscription: Subscription;
  siteAliases: SiteAlias[];
  totalRows = 0;

  constructor(private lustDataService: LustDataService, private route: ActivatedRoute, private router: Router) {
    this.siteAliasDataSource = new SiteAliasResultDataSourceService(this.lustDataService);
  }
  ngOnInit() {
    console.log('on init .....');
    // this.lustId = +this.route.snapshot.params['lustid'];
    this.lustId = 37067;
    this.loadResultPage();
    this.getSearchResults();
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
    console.log('loadResultPage() .....' + this.lustId);
    console.log(this.siteAliasDataSource);
    // this.lustSearchFilter.pageNumber = this.paginator.pageIndex + 1;
    // this.lustSearchFilter.rowsPerPage = ((this.paginator.pageSize === 0 || this.paginator.pageSize === undefined)
    //       ? 40 : this.paginator.pageSize);
    // this.lustSearchFilter.sortColumn = (this.sort.active === undefined ? 1 : this.getSortCol(this.sort.active));
    // this.lustSearchFilter.sortOrder = this.getSortOrder(this.sort.direction);
    this.siteAliasDataSource.loadResults(this.lustId);
  }


  getSearchResults() {
    this.subscription = this.siteAliasDataSource.siteAliasResultReturned$.subscribe(
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

