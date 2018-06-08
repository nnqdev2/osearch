import { ErrorHandler, Injector, forwardRef, Inject } from '@angular/core';
import { LogService } from './log.service';
import { LogPublisher } from './log-publishers';
import { LogPublishersService } from './log-publishers.service';

export class AppErrorHandler implements ErrorHandler {
    // constructor(private injector: Injector) { }
    constructor(@Inject(forwardRef(() => LogService)) private logService: LogService) { }
    handleError(error) {
        console.log('*******AppErrorHandler error $error');
        console.log(`*********error====> ` + error);

        // const logService = this.injector.get(LogService);
        const message = error.message ? error.message : error.toString();
        this.logService.error(error);
      // do something with the exception
      // IMPORTANT: Rethrow the error otherwise it gets swallowed
     throw error;
    }
  }
