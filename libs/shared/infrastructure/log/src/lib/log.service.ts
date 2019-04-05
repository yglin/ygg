import { Injectable } from '@angular/core';
import { LogLevel, Log, LogFilter } from './log';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  logs: Log[];
  logs$: BehaviorSubject<Log[]>;
  filter: LogFilter;
  [wrapperFnuctions: string]: any;

  constructor() {
    this.logs = [];
    this.logs$ = new BehaviorSubject(this.logs);
    this.filter = new LogFilter(LogLevel.Debug);

    // Build wrapper functions for each level
    // tslint:disable-next-line: forin
    for (const key in LogLevel) {
      const level = parseInt(key, 10);
      if (level >= 0) {
        const methodName = (LogLevel[level] as string).toLowerCase();
        this[methodName] = (message: any) => this.log(message, level);
      }
    }

    // Intercept console log methods
    const consoleMethodsMapping = {
      log: this.info,
      info: this.info,
      error: this.error,
      warn: this.warning,
      debug: this.debug,
      trace: this.trace
    };
    this.interceptConsole(consoleMethodsMapping);
  }

  log(message: any, level: LogLevel = LogLevel.Info) {
    const newLog = new Log(message, level);
    if (this.filter.pass(newLog)) {
      this.logs.push(newLog);
      this.logs$.next(this.logs);
    }
  }

  interceptConsole(mappings: any = {}) {
    for (const methodName in mappings) {
      if (mappings.hasOwnProperty(methodName)) {
        const doSomething = mappings[methodName];
        interceptConsoleMethod(methodName, doSomething);
      }
    }
  }

  buildlevelWrappers(mappings: any = {}) {
    for (const methodName in mappings) {
      if (mappings.hasOwnProperty(methodName)) {
        const level = mappings[methodName];
        this[methodName] = (message: any) => this.log(message, level);
      }
    }
  }
}

function interceptConsoleMethod(methodName: string, doSomething: Function) {
  try {
    if (
      methodName in window.console &&
      typeof window.console[methodName] === 'function'
    ) {
      const originalMethod = window.console[methodName];
      window.console[methodName] = function() {
        doSomething(arguments[0]);
        if (originalMethod.apply) {
          originalMethod.apply(originalMethod, [window.console, arguments]);
        } else {
          // For IE
          const message = Array.prototype.slice.apply(arguments).join(' ');
          originalMethod(message);
        }
      };
    } else {
      throw new Error(`window.console has no method: ${methodName}`);
    }
  } catch (error) {
    console.error(error);
  }
}
