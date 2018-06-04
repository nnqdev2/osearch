import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { LustDataService } from '../service/lust-data.service';
import { OlprrSearchResultsDataSource } from './olprr-search-results-data-source';
import { OlprrSearchFilter } from '../models/olprr-search-filter';
import { MatPaginator } from '@angular/material';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-olprr-search-result',
  templateUrl: './olprr-search-result.component.html',
  styleUrls: ['./olprr-search-result.component.scss']
})
export class OlprrSearchResultComponent implements AfterViewInit, OnInit, OnChanges {

  @Input() olprrSearchFilter: OlprrSearchFilter;


  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: OlprrSearchResultsDataSource;
  // displayedColumns = ['olprrId', 'dateReceived', 'siteName'];
  displayedColumns = ['olprrId', 'siteStatus', 'releaseType', 'receivedDate', 'siteName', 'siteAddress', 'siteCounty', 'reportedBy'];


  constructor(private lustDataService: LustDataService) {
    console.log('constructor() this.olprrSearchFilter');
    console.log(this.olprrSearchFilter);
    this.dataSource = new OlprrSearchResultsDataSource(this.lustDataService);
  }

  ngOnChanges(changes: SimpleChanges) {

    console.log('****ngOnChanges');
    console.log(changes);
    console.log(this.olprrSearchFilter);
    this.loadIncidentsPage();
    // this.dataSource.loadIncidents(this.olprrSearchFilter);
    console.log('****ngOnChanges done');

    // if (changes.myNum && !changes.myNum.isFirstChange()) {
    //   // exteranl API call or more preprocessing...
    // }

    // for (let propName in changes) {
    //   const change = changes[propName];
    //   console.dir(change);
    //   if (change.isFirstChange()) {
    //     console.log(`first change: ${propName}`);
    //   } else {
    //     console.log(`prev: ${change.previousValue}, cur: ${change.currentValue}`);
    //   }
    // }
  }

  ngOnInit() {
    console.log('ngOnInit() this.olprrSearchFilter');
    console.log(this.olprrSearchFilter);
    // this.dataSource = new OlprrSearchResultsDataSource(this.lustDataService);
    // this.dataSource.loadIncidents(this.olprrSearchFilter);
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit() this.olprrSearchFilter');
    console.log(this.olprrSearchFilter);
    this.paginator.page
        .pipe(
            tap(() => this.loadIncidentsPage())
        )
        .subscribe();
  }

  loadIncidentsPage() {
    console.log('loadIncidentsPage() this.olprrSearchFilter');
    console.log(this.olprrSearchFilter);
    this.dataSource.loadIncidents(this.olprrSearchFilter);
  }
  // loadIncidentsPage() {
  //   this.dataSource.loadIncidents(
  //       this.course.id,
  //       '',
  //       'asc',
  //       this.paginator.pageIndex,
  //       this.paginator.pageSize);
  // }
}


