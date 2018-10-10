import { Component, OnInit, AfterViewInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';

import { ContactsResultDataSourceService } from '../../contact/contacts/contacts-result-data-source.service';
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
  contactDataSource: ContactsResultDataSourceService;
  displayedColumns = ['affilId', 'affilTypeDesc', 'startDt', 'endDt', 'organization', 'subOrganization', 'jobtitle'
                       , 'firstName', 'lastName', 'zp4Checked', 'affilComments', 'lastUpdBy', 'lastUpdDttm'];
  private subscription: Subscription;
  private contactAffilGets: ContactAffilGet[];
  private totalRows = 0;
  private confirmDeleteDialogRef: MatDialogRef<ConfirmDeleteDialogComponent, any>;

  constructor(private lustDataService: LustDataService, private route: ActivatedRoute, private router: Router
              , private confirmDeleteDialog: MatDialog) {
    this.contactDataSource = new ContactsResultDataSourceService(this.lustDataService);
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
    this.contactDataSource.loadResults(this.lustId);
  }

  getSearchResults() {
    this.subscription = this.contactDataSource.contactResultReturned$.subscribe(
      contactAffilGets => {
        this.contactAffilGets = contactAffilGets;
        if (this.contactAffilGets !== undefined &&
          this.contactAffilGets.length > 0) {
            this.totalRows = this.contactAffilGets.length;
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

  edit(contact: ContactAffilGet) {
    console.log('edit(contact: ContactAffilGet)');
    console.log(contact);
    this.router.navigate(['../contact' , contact.affilId], {relativeTo: this.route});
  }

  add() {
    this.router.navigate(['../contact'], {relativeTo: this.route});
  }

  refresh() {
    this.loadResultPage();
    this.getSearchResults();
  }
}
