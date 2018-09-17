import { Component, OnInit, AfterViewInit, OnChanges, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';

import { SiteAlias } from '../../../models/site-alias';
import { LustDataService } from '../../../services/lust-data.service';
import { ConfirmDeleteDialogComponent } from '../../confirm-delete-dialog/confirm-delete-dialog.component';
import { SiteAliasesResultDataSourceService } from './site-aliases-result-data-source.service';
import { ApGetLogNumber } from '../../../models/apGetLogNumber';

@Component({
  selector: 'app-site-aliases',
  templateUrl: './site-aliases.component.html',
  styleUrls: ['./site-aliases.component.scss']
})
export class SiteAliasesComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  private lustIdSub: any;
  private lustId: number;
  private logNumber: string;
  private siteAliasDataSource: SiteAliasesResultDataSourceService;
  private displayedColumns = ['siteNameAliasId', 'siteAliasName', 'lastChangeBy', 'lastChangeDate'];
  private subscription: Subscription;
  private siteAliases: SiteAlias[];
  private totalRows = 0;
  private confirmDeleteDialogRef: MatDialogRef<ConfirmDeleteDialogComponent, any>;

  constructor(private lustDataService: LustDataService, private route: ActivatedRoute, private router: Router
              , private confirmDeleteDialog: MatDialog) {
    this.siteAliasDataSource = new SiteAliasesResultDataSourceService(this.lustDataService);
  }

  ngOnInit() {
    this.lustIdSub = this.route.parent.params.subscribe(params => {
      this.lustId = +params['lustid'];
    });
    this.route.data.subscribe((data: {apGetLogNumber: ApGetLogNumber}) => {
      this.logNumber = data.apGetLogNumber.logNumber; });
    this.loadResultPage();
    this.getSearchResults();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadResultPage();
    this.getSearchResults();
  }

  ngAfterViewInit() {
  }

  loadResultPage() {
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
    this.lustIdSub.unsubscribe();
  }

  onEdit(siteAlias: SiteAlias) {
    this.router.navigate(['../sitealias' , siteAlias.siteNameAliasId], {relativeTo: this.route});
  }

  onDelete(siteAlias: SiteAlias) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm Delete',
      message1: 'Are you sure you want to delete site alias ' + siteAlias.siteNameAlias + ' ?' ,
    };
    dialogConfig.disableClose =  true;
    this.confirmDeleteDialogRef = this.confirmDeleteDialog.open(ConfirmDeleteDialogComponent, dialogConfig);
    this.confirmDeleteDialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.lustDataService.delSiteAlias(siteAlias.siteNameAliasId).subscribe();
        this.loadResultPage();
        this.getSearchResults();
      }
    });
  }

  add() {
    this.router.navigate(['../sitealias'], {relativeTo: this.route});
  }

  refresh() {
    this.loadResultPage();
    this.getSearchResults();
  }
}
