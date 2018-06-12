import { Injectable } from '@angular/core';
import { LogPublisher } from './log-publishers';
import { LogPublishersService } from './log-publishers.service';
import { getLocaleDateTimeFormat } from '@angular/common';

export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6
}

export class LogEntry {
  // Public properties
  entryDate = new Date().toLocaleString();
  message = '';
  logLevel: LogLevel = LogLevel.Debug;
  // extraInfo: any[] = [];
  // extraInfo = '';
  logWithDate = true;

  buildLogString(): string {
    let ret = '';

    if (this.logWithDate) {
      ret = new Date() + ' - ';
    }
    ret += 'Type: ' + LogLevel[this.logLevel];
    ret += ' - Message: ' + this.message;
    // if (this.extraInfo.length) {
    //   ret += ' - Extra Info: ' + this.formatParams(this.extraInfo);
    // }

    return ret;
  }

  private formatParams(params: any[]): string {
    let ret: string = params.join(',');

    if (params.some(p => typeof p === 'object')) {
      ret = '';
      for (const param of params) {
        ret += JSON.stringify(param) + ',';
      }
    }
    return ret;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  constructor(private publishersService: LogPublishersService) {
    // Set all the publishers into the local array
    this.publishers = this.publishersService.publishers;
  }

  // Public properties
  logLevel: LogLevel = LogLevel.All;
  logWithDate = true;
  publishers: LogPublisher[];

  private shouldLog(level: LogLevel): boolean {
    let ret = false;

    if (this.logLevel !== LogLevel.Off && level >= this.logLevel) {
      ret = true;
    }

    return ret;
  }

  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  error(msg: string, ...optionalParams: any[]) {
    console.error ('***** LOGSERVICE.ERROR  about to this.writeToLog  msg:' + msg + ' optionalParams: ' + optionalParams);
    this.writeToLog(msg, LogLevel.Error, optionalParams);
    console.error ('***** LOGSERVICE.ERROR  done this.writeToLog  msg:' + msg + ' optionalParams: ' + optionalParams);
  }

  fatal(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  log(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  clear(): void {
    for (const logger of this.publishers) {
      logger.clear();
    }
  }

  private writeToLog(msg: string, logLevel: LogLevel, params: any[]) {
    if (this.shouldLog(logLevel)) {
      const entry: LogEntry = new LogEntry();

      console.error ('***** LOGSERVICE.WRITETOLOG  1  msg:' + msg + ' optionalParams: ' + params);

      entry.message = msg;
      entry.logLevel = logLevel;
      // entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;

      console.error ('***** LOGSERVICE.WRITETOLOG  2  entry record' );
      console.log( entry ) ;
      console.error ('***** LOGSERVICE.WRITETOLOG  2  entry record' );
      const entryJson = JSON.stringify(entry);

      // Log the value to all publishers
      for (const logger of this.publishers) {
        logger.log(entry).subscribe(response => console.error ('***** LOGSERVICE.WRITETOLOG 3: location ' +
        logger.location + ' response===> ' + response));
      }
    }
  }
}
