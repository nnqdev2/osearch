import { ErrorHandler, Injector, forwardRef, Inject, Injectable, NgZone } from '@angular/core';
import { LogService } from './log.service';
import { LogPublisher } from './log-publishers';
import { LogPublishersService } from './log-publishers.service';
import * as StackTrace from 'stacktrace-js';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorsService } from './errors/errors.service';
import { Router } from '@angular/router';
import { UiError } from './errors/errors';

@Injectable()
export class AppErrorHandler extends ErrorHandler {

  private elaborating = false;
  private uiError: UiError;
  constructor(private injector: Injector, private ngZone: NgZone) { super(); }
    // handleError(error: Error | HttpErrorResponse) {
    handleError(error: any): void {
      console.log('AppErrorHandler.handleError error thrown ===> ');
      console.error(error);
      console.log('AppErrorHandler.handleError error.stack thrown ===> ');
      console.error(error.stack);
      console.log('AppErrorHandler.handleError error.stackString thrown ===> ');
      console.error(error.stackString);

      const errorsService = this.injector.get(ErrorsService);
      const router = this.injector.get(Router);
      const offendingUrl = router.url;
      errorsService.log(error).subscribe(data => this.uiError = data);

      console.log(this.uiError);

      if (!this.elaborating) {
        this.elaborating = true;
        this.ngZone.run(() => {
          this.elaborating = false;
          router.navigate(['/error'], { queryParams: {errname: this.uiError.errorType, uiurl: this.uiError.uiUrl
              , apiurl: this.uiError.apiUrl, status: this.uiError.statusCode , message: this.uiError.errorMessage.toString()} });
        });
      }
    }
  }


