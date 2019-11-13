import { Component, OnInit, Input } from '@angular/core';
import { DayTimeRange } from './day-time-range';

@Component({
  selector: 'ygg-day-time-range',
  templateUrl: './day-time-range.component.html',
  styleUrls: ['./day-time-range.component.css']
})
export class DayTimeRangeComponent implements OnInit {
  @Input() dayTimeRange: DayTimeRange;
  
  constructor() { }

  ngOnInit() {
  }

}
