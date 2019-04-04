import { Component, OnInit, Input } from '@angular/core';
import { LogService, LogLevel } from '@ygg/shared/infrastructure/log';

@Component({
  selector: 'ygg-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.css']
})
export class LoggingComponent implements OnInit {
  @Input() message;
  levels: { label: string, value: number }[];
  selectedLevel: LogLevel;

  constructor(
    private logService: LogService
  ) {
    this.levels = [];
// tslint:disable-next-line: forin
    for (const index in LogLevel) {
      const value = parseInt(index, 10);
      if (LogLevel.hasOwnProperty(index) && value > 0) {
        this.levels.push({
          label: LogLevel[index],
          value: value
        });
      }
    }
  }

  ngOnInit() {
  }

  logMessage() {
    this.logService.log(this.message, this.selectedLevel);
    // console.dir(this.logService.logs);
  }
}
