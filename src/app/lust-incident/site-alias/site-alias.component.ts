import { Component, OnInit, AfterViewInit, OnChanges, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { SiteAliasResultDataSourceService } from './site-alias-result-data-source.service';
import { Subscription } from 'rxjs';
import { SiteAlias } from '../../models/site-alias';
import { LustDataService } from '../../services/lust-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

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
  displayedColumns = ['siteNameAliasId', 'siteAliasName', 'lastChangeBy', 'lastChangeDate'];
  subscription: Subscription;
  siteAliases: SiteAlias[];
  totalRows = 0;

  confirmDeleteDialogRef: MatDialogRef<ConfirmDeleteDialogComponent, any>;

  constructor(private lustDataService: LustDataService, private route: ActivatedRoute, private router: Router
              , private confirmDeleteDialog: MatDialog) {
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

  onEdit(siteAlias: SiteAlias) {
    console.log('onEdit');
    console.log(siteAlias);
  }

  onDelete(siteAlias: SiteAlias) {
    console.log('onDelete');
    console.log(siteAlias);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm Delete',
      message1: 'Are you sure you want to delete site alias ' + siteAlias.siteNameAlias + ' ?' ,
    };
    dialogConfig.disableClose =  true;
    this.confirmDeleteDialogRef = this.confirmDeleteDialog.open(ConfirmDeleteDialogComponent, dialogConfig);
    this.confirmDeleteDialogRef.afterClosed().subscribe(result => {
      console.log('after confirm delete');
      console.log(result);
      if (result === 'confirm') {
        console.log('siteAlias.siteNameAliasId ====>' + siteAlias.siteNameAliasId);
        this.lustDataService.delSiteAlias(siteAlias.siteNameAliasId).subscribe();
        this.loadResultPage();
        this.getSearchResults();
      }
    });
  }
}

