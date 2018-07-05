import { ErrorHandler, Injector, forwardRef, Inject } from '@angular/core';
import { LogService } from './log.service';
import { LogPublisher } from './log-publishers';
import { LogPublishersService } from './log-publishers.service';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import * as StackTrace from 'stacktrace-js';

export class AppErrorHandler implements ErrorHandler {
    // constructor(private injector: Injector) { }
    constructor(@Inject(forwardRef(() => LogService)) private logService: LogService
                , @Inject(forwardRef(() => LocationStrategy)) private location: LocationStrategy
              ) { }
    handleError(error) {
        console.log('*******AppErrorHandler error $error before  ==> ' + error);

        // const logService = this.injector.get(LogService);
        // const location = this.injector.get(LocationStrategy);
        const message = error.message ? error.message : error.toString();


        const url = this.location instanceof PathLocationStrategy ? this.location.path() : '';

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
