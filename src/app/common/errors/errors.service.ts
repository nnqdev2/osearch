import { Injectable, forwardRef, Inject } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router, NavigationError } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import * as StackTrace from 'stacktrace-js';
import { Observable, of } from 'rxjs';
import { UiError } from './errors';

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {

  constructor(private router: Router)  {
    // this.router
    //   .events
    //   .subscribe(event => {
    //     if (event instanceof NavigationError) {
    //       this.log(event.error)
    //         .subscribe((errorWithContext) => {
    //           console.log('in ErrorService constructor event instanceof NavigationError ');
    //           this.router.navigate(['/error'], { queryParams: errorWithContext });
    //         });
    //   }
    // });
  }

log(error: any): Observable<any> {
  const uiError = new UiError();
  uiError.appId = 'HOTC_OLPRR_LUST';
  uiError.errorDateTime = new Date().getTime();
  uiError.uiUrl = this.router.url;
  uiError.userId = 'HOL User';   // todo: aduser
  if (error instanceof HttpErrorResponse) {
      const httpErrorResponse = <HttpErrorResponse>error;
      uiError.errorType = 'HttpErrorResponse';
      uiError.statusCode  = httpErrorResponse.status.toString();
      uiError.errorMessage = JSON.stringify(httpErrorResponse.error);
      uiError.apiUrl = httpErrorResponse.url;
    } else {
      uiError.errorType = error.name;
      uiError.errorMessage = error.message;
      uiError.stackTrace = error.stack;
    }
    const errorWithContext = {errname: uiError.errorType, uiurl: uiError.uiUrl
        , apiurl: uiError.uiUrl, status: uiError.statusCode , message: uiError.errorMessage};
    return fakeHttpService.post(uiError);
  }

  private formatError(error: Error): UiError {
    const uiError = new UiError();
    uiError.appId = 'HOTC_OLPRR_LUST';
    uiError.errorDateTime = new Date().getTime();
    uiError.uiUrl = this.router.url;
    uiError.userId = 'HOL User';
  if (error instanceof HttpErrorResponse) {
      uiError.errorType = 'HttpErrorResponse';
      uiError.statusCode  =   (<HttpErrorResponse>error).status.toString();
      uiError.errorMessage = (<HttpErrorResponse>error).error;
    } else {
      uiError.errorType = error.name;
      uiError.errorMessage = error.message;
      uiError.stackTrace = error.stack;
    }

    console.log('UiError ...............');
    console.log(uiError);
    return uiError;
  }

  /*
  // private addContextInfo(error: Error | HttpErrorResponse | TypeError) {
  private addContextInfo(error: any) {

    console.log('ErrorsService --- addContextInfo(error: any)');
    console.log(error);

    const appId = 'HOTC_OLPRR_LUST';
    const time = new Date().getTime();
    const id = `${appId}-${time}`;
    const url = this.router.url;
    let errorStatusCode = error.status || null;
    let errorMessage = error.message || error.toString();
    let errorType;
    let errorStack;
  ;  if (error instanceof HttpErrorResponse) {
      errorType = 'HttpErrorResponse';
      errorStatusCode =   (<HttpErrorResponse>error).status;
      errorMessage = (<HttpErrorResponse>error).error;
    } else {
      errorType = error.name;
      errorStatusCode =  null;
      errorMessage = error.message;
      errorStack = error.StackTrace;
    }

    // const stack = error instanceof HttpErrorResponse ? null : StackTraceParser.parse(error);
    // StackTrace.fromError(error).then(stackframes => {
    //   const stackString = stackframes
    //     .splice(0, 20)
    //     .map(function(sf) {
    //       return sf.toString();
    //     }).join('\n');

    const errorWithContext = {name, appId, user, time, id, url, status, message, stack};
    return errorWithContext;
  }
  */

}

// tslint:disable-next-line:class-name
export class fakeHttpService {
  static post(error: UiError): Observable<any> {
    console.log('Error sent to the server: ', error);
    return of(error);
  }
}

// tslint:disable-next-line:class-name
// export class fakeHttpService {
//   static post(error): Observable<any> {
//     console.log('Error sent to the server: ', error);
//     return of(error);
//   }
// }
