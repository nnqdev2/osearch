import { ErrorHandler, Injector, forwardRef, Inject, Injectable, NgZone } from '@angular/core';
import { LogService } from './log.service';
import { LogPublisher } from './log-publishers';
import { LogPublishersService } from './log-publishers.service';
import * as StackTrace from 'stacktrace-js';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorsService } from './errors/errors.service';
import { Router } from '@angular/router';
import { UiError } from './errors/errors';
import { MatDialog } from '@angular/material';
import { SubmitStatusDialogComponent } from './dialogs/submit-status-dialog.component';
import { ErrorsDialogComponent } from './errors/errors-dialog.component';

@Injectable()
export class AppErrorHandler extends ErrorHandler {

  private elaborating = false;
  private uiError: UiError;
  constructor(private injector: Injector, private ngZone: NgZone) { super(); }
    // handleError(error: Error | HttpErrorResponse) {
    handleError(error: any): void {
      console.log('AppErrorHandler.handleError(error: any) ');
      console.error(error);
      console.error(error.stack);
      console.error(error.stackString);

      const dialog = this.injector.get(MatDialog);
      const errorsService = this.injector.get(ErrorsService);
      const router = this.injector.get(Router);
      const offendingUrl = router.url;
      errorsService.log(error).subscribe(data => this.uiError = data);

      console.log(this.uiError);

      // router.navigate(['/error'], { queryParams: this.myData });
      // window.location.href = '/error';


      if (!this.elaborating) {
        this.elaborating = true;
        // const callback: () => void = () => { console.log('default callback'); };
        const callback: () => void = () => {  console.log('default callback'); this.elaborating = false; router.navigate(['/error']); };
        if (!(error instanceof HttpErrorResponse) ) {
            console.log('AppErrorHandler handleError: not an http error.');
            this.elaborating = false;
            router.navigate(['/error'], { queryParams: {errname: this.uiError.errorType, uiurl: this.uiError.uiUrl
                , apiurl: this.uiError.uiUrl, status: this.uiError.statusCode , message: this.uiError.errorMessage.toString()} });
        } else {
            const message1 = 'Backend request ' + this.uiError.apiUrl + ' returned \n '
            + ' status code:  ' + this.uiError.statusCode + '\n '
            + ' error message: ' + this.uiError.errorMessage ;
            this.ngZone.run(() => {
                dialog.open(ErrorsDialogComponent, {
                data: {
                    title: this.uiError.errorType,
                    message1: message1,
                    button1: 'Error Page',
                    callback: callback
                }
                });
            });
        }






    }
    }

//   private formatError(error: Error, offendingUrl: string): UiError {
//     const uiError = new UiError();
//     uiError.appId = 'HOTC_OLPRR_LUST';
//     uiError.errorDateTime = new Date().getTime();
//     uiError.uiUrl = offendingUrl;
//     uiError.userId = 'HOL User';
//   if (error instanceof HttpErrorResponse) {
//       uiError.errorType = 'HttpErrorResponse';
//       uiError.statusCode  =   (<HttpErrorResponse>error).status.toString();
//       uiError.errorMessage = (<HttpErrorResponse>error).error;
//     } else {
//       uiError.errorType = error.name;
//       uiError.errorMessage = error.message;
//       uiError.stackTrace = error.stack;
//     }
//     return uiError;
//   }



      /*

    handleErrorOrig(error: any) {
    // handleError(error: Error | HttpErrorResponse) {
        console.log('*******AppErrorHandler handleError error  ==> ');
        console.log(error);
        console.log('*******AppErrorHandler handleError error stack  ==> ' );
        console.log(error.stack);
        console.log('*******AppErrorHandler handleError error  string ==> ' );
        console.log(error.stackString);

        const notificationService = this.injector.get(NotificationService);
        console.log('*******AppErrorHandler handleError after notification ' );
        const errorsService = this.injector.get(ErrorsService);
        console.log('*******AppErrorHandler handleError after errors ' );
        const router = this.injector.get(Router);
        console.log('*******AppErrorHandler handleError after router ' );

        if (error instanceof HttpErrorResponse) {
          console.error('There was an HTTP error.', error.message, 'Status code:', (<HttpErrorResponse>error).status);
          console.error('There was an HTTP error.', error.error, 'Status code:', (<HttpErrorResponse>error).statusText);
          // errorsService.log(error).subscribe();
          errorsService
            .log(error)
            .subscribe(errorWithContextInfo => {
              console.log('********************handleError() errorService subscribing errorWithContextInfo ');
              console.log(errorWithContextInfo);
              router.navigate(['error'], { queryParams: errorWithContextInfo });
              console.log('********************handleError() errorService subscribing  why we are not moving on');
            });
          // Show notification to the user
          // notificationService.notify(`${error.status} - ${error.message}`);
          // router.navigate(['/error']);
        } else if (error instanceof TypeError) {
            console.error('There was a Type error.', error.message);
        } else if (error instanceof Error) {
            console.error('There was a general error.', error.message);
        } else {
            console.error('Nobody threw an error but something happened!', error);
        }


        // errorsService
        // .log(error)
        // .subscribe(errorWithContextInfo => {
        //   router.navigate(['/error'], { queryParams: errorWithContextInfo });
        // });

        // const logService = this.injector.get(LogService);
        // const location = this.injector.get(LocationStrategy);
        const message = error.message ? error.message : error.toString();
        // let theError: string;

      //   if (error instanceof HttpErrorResponse) {
      //     theError = error.error ? error.error : error.toString();
      //     // Server or connection error happened
      //     if (!navigator.onLine) {
      //       // Handle offline error
      //       return notificationService.notify('No Internet Connection');
      //     } else {
      //       // Handle Http Error (error.status === 403, 404...)
      //       return notificationService.notify(`${error.status} - ${error.message}`);
      //     }
      //  } else {
      //    // Handle Client Error (Angular Error, ReferenceError...)
      //  }

        // const url = this.location instanceof PathLocationStrategy ? this.location.path() : '';
        console.log('**** offending message =====> ');
        console.log(message);
        console.log('**** offending theError =====> ');
        // console.log(test.error());
        console.log('**** offending url =====> ');
        // console.log(url);

        // get the stack trace, lets grab the last 10 stacks only
        // StackTrace.fromError(error).then(stackframes => {
        //   const stackString = stackframes
        //     .splice(0, 20)
        //     .map(function(sf) {
        //       return sf.toString();
        //     }).join('\n');

        console.log('*******AppErrorHandler error $error after ==> ' + error);

        // this.logService.error(error);
      // do something with the exception
      // IMPORTANT: Rethrow the error otherwise it gets swallowed
     // throw error;
    }
    */
  }



//   export class DialogErrorHandler extends ErrorHandler {
//     private elaborating = false;
//     constructor(private injector: Injector, private ngzone: NgZone) {
//         super();
//     }
//     handleError(error: any): void {
//         if (!this.elaborating) {
//             this.elaborating = true;
//             let finalMessage = '!!!Error!!!!';
//             let finalCallback: () => void = () => { console.log('default callback'); };
//             const dialog: MatDialog = this.injector.get(MatDialog);
//             const router: Router = this.injector.get(Router);
//             if (!(error instanceof HttpErrorResponse) ) {
//                 console.log('AppErrorHandler handleError: not an http error.');
//                 this.elaborating = false;
//             } else {
//                 const errorDesc = 'Request to ' + localError.url + '\n' + localError.status +
//                     ' ' + localError.statusText + ': ' + localError.error;
//                 switch (localError.status) {
//                     case 403:
//                         finalMessage = 'La sessione è scaduta, ripeti il login.';
//                         finalCallback = () => { login.logout(); router.navigate['/login']; };
//                         break;
//                     case 500:
//                         finalMessage = 'Errore sul server - ' + errorDesc;
//                         break;
//                     default:
//                         finalMessage = errorDesc;
//             }


//                 this.ngzone.run(() => {
//                     dialog.open(MessageDialog, {
//                         data: {
//                             message: finalMessage,
//                             callback: () => { finalCallback(); this.elaborating = false; }
//                         }
//                     });
//                 });
//             }
//         }
//         super.handleError(error);
//     }

// }
