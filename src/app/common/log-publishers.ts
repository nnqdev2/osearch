import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { catchError, tap} from 'rxjs/operators';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';
import { LogEntry } from './log.service';

export abstract class LogPublisher {
  location: string;

  abstract log(record: LogEntry): Observable<boolean>;
  abstract clear(): Observable<boolean>;
}

export class LogConsole extends LogPublisher {
  log(record: LogEntry): Observable<boolean> {
    // Log to the console
    console.log(record.buildLogString());

    return of(true);
  }

  clear(): Observable<boolean> {
    console.clear();

    return of(true);
  }
}

export class LogLocalStorage extends LogPublisher {
  constructor() {
    super();

    this.location = 'logging';
  }

  getAll(): Observable<LogEntry[]> {
    let values: LogEntry[];

    // Retrieve all values from local storage
    values = JSON.parse(localStorage.getItem(this.location)) || [];

    return of(values);
  }

  log(record: LogEntry): Observable<boolean> {
    const ret = false;
    let values: LogEntry[];

    try {
      values = JSON.parse(localStorage.getItem(this.location)) || [];
      // Add new log entry to the array
      values.push(record);
      // Store the complete array into local storage
      localStorage.setItem(this.location, JSON.stringify(values));
    } catch (ex) {
      console.log(ex);
    }

    return of(ret);
  }

  clear(): Observable<boolean> {
    localStorage.removeItem(this.location);
    return of(true);
  }
}

export class LogPublisherConfig {
  loggerName: string;
  loggerLocation: string;
  isActive: boolean;
}

export class LogWebApi extends LogPublisher {
  constructor(private http: HttpClient) {
    super();

  }

  log(record: LogEntry): Observable<boolean> {
    // const httpOptions = {
    //     headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    //   };

      this.location = environment.olprrapi + 'log';

    // return this.http.post(this.location, record, httpOptions)
    //   .map(response => response.json)
    //   .catch(this.handleErrors);

    const testJSON = JSON.stringify(record);
    console.error('*** LOGWEBAPI.LOG: ' + this.location);
    console.error('*** LOGWEBAPI.LOG:  log api payload: ' + JSON.stringify(record));
    console.error(record);

    return this.http.post(this.location, testJSON)
        .pipe(
        tap(data => console.error('**********$$$$$$$All: ' + JSON.stringify(data))),
        catchError(this.handleErrors)
        );
  }

  clear(): Observable<boolean> {
    // TODO: Call Web API to clear all log entries
    return of(true);
  }

  private handleErrors(error: any): Observable<any> {
    const errors: string[] = [];
    let msg = '';

    console.error('**** LOGPUBLISHER.HANDLEERRORS  error 111');
    console.error( error );
    console.error('**** LOGPUBLISHER.HANDLEERRORS  error 111');

    msg = 'Status: ' + error.status;
    msg += ' - Status Text: ' + error.statusText;
    // if (error.json()) {
    //   msg += ' - Exception Message: ' + error.json().exceptionMessage;
    // }

    errors.push(msg);

    console.error('**** LOGPUBLISHER.HANDLEERRORS errors 222');
    console.error( errors );
    console.error('**** LOGPUBLISHER.HANDLEERRORS errors 222');

    return Observable.throw(errors);
  }
}
