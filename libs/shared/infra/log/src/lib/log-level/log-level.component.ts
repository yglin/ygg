import { Component, OnInit, Input } from '@angular/core';
import { LogLevel, getLogLevelName } from '../log';

@Component({
  selector: 'ygg-log-level',
  templateUrl: './log-level.component.html',
  styleUrls: ['./log-level.component.css']
})
export class LogLevelComponent implements OnInit {
  @Input() level: LogLevel;

  constructor() { }

  ngOnInit() {
  }

  getLevelName(): string {
    return getLogLevelName(this.level);
  }
}
