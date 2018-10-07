import { Component, OnInit, AfterViewInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ContactsResultDataSourceService } from '../../contact/contacts/contacts-result-data-source.service';
import { Subscription } from 'rxjs';

import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmDeleteDialogComponent } from '../../confirm-delete-dialog/confirm-delete-dialog.component';
import { LustDataService } from '../../../services/lust-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApGetLogNumber } from '../../../models/apGetLogNumber';
import { ContactAffilGet } from '../../../models/contact-affil-get';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  private lustIdSub: any;
  private lustId: number;
  logNumber: string;
  contactsDataSource: ContactsResultDataSourceService;
  displayedColumns = ['affilId', 'affilTypeDesc', 'startDt', 'endDt', 'organization', 'subOrganization', 'jobtitle'
                      , 'firstName', 'lastName', 'lastUpdBy', 'lastUpdDttm', 'zp4Checked', 'affilComments'];
  private subscription: Subscription;
  private contacts: ContactAffilGet[];
  private totalRows = 0;
  private confirmDeleteDialogRef: MatDialogRef<ConfirmDeleteDialogComponent, any>;

  constructor(private lustDataService: LustDataService, private route: ActivatedRoute, private router: Router
              , private confirmDeleteDialog: MatDialog) {
    this.contactsDataSource = new ContactsResultDataSourceService(this.lustDataService);
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
    this.contactsDataSource.loadResults(this.lustId);
  }

  getSearchResults() {
    this.subscription = this.contactsDataSource.contactResultReturned$.subscribe(
      siteAliases => {
        this.contacts = siteAliases;
        if (this.contacts !== undefined &&
          this.contacts.length > 0) {
            this.totalRows = this.contacts.length;
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

  onEdit(contact: ContactAffilGet) {
    this.router.navigate(['../contact' , contact.affilId], {relativeTo: this.route});
  }

  // onDelete(contact: ContactAffilGet) {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.data = {
  //     title: 'Confirm Delete',
  //     message1: 'Are you sure you want to delete contact ' + contact.firstName + ' ' + contact.lastName + ' ?' ,
  //   };
  //   dialogConfig.disableClose =  true;
  //   this.confirmDeleteDialogRef = this.confirmDeleteDialog.open(ConfirmDeleteDialogComponent, dialogConfig);
  //   this.confirmDeleteDialogRef.afterClosed().subscribe(result => {
  //     if (result === 'confirm') {
  //       this.lustDataService.delSiteAlias(contact.siteNameAliasId).subscribe();
  //       this.loadResultPage();
  //       this.getSearchResults();
  //     }
  //   });
  // }

  add() {
    this.router.navigate(['../contact'], {relativeTo: this.route});
  }

  refresh() {
    this.loadResultPage();
    this.getSearchResults();
  }
}
