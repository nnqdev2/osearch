import { ErrorHandler, Injector, forwardRef, Inject } from '@angular/core';
import { LogService } from './log.service';
import { LogPublisher } from './log-publishers';
import { LogPublishersService } from './log-publishers.service';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import * as StackTrace from 'stacktrace-js';
import { HttpErrorResponse } from '@angular/common/http';

export class AppErrorHandler implements ErrorHandler {
    // constructor(private injector: Injector) { }
    constructor(@Inject(forwardRef(() => LogService)) private logService: LogService
                , @Inject(forwardRef(() => LocationStrategy)) private location: LocationStrategy
              ) { }
    handleError(error: Error | HttpErrorResponse) {
        console.log('*******AppErrorHandler handleError error  ==> ');
        console.log(error);
        console.log('*******AppErrorHandler handleError error   ==> ' );

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

        const url = this.location instanceof PathLocationStrategy ? this.location.path() : '';
        console.log('**** offending message =====> ');
        console.log(message);
        console.log('**** offending theError =====> ');
        // console.log(test.error());
        console.log('**** offending url =====> ');
        console.log(url);

        // get the stack trace, lets grab the last 10 stacks only
        StackTrace.fromError(error).then(stackframes => {
          const stackString = stackframes
            .splice(0, 20)
            .map(function(sf) {
              return sf.toString();
            }).join('\n');

        console.log('*******AppErrorHandler error $error after ==> ' + error);

        // this.logService.error(error);
      // do something with the exception
      // IMPORTANT: Rethrow the error otherwise it gets swallowed
     throw error;
    });
  }
}
