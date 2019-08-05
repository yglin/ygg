import { Component, OnInit, Input } from '@angular/core';
import { TimeRange } from './time-range';

@Component({
  selector: 'ygg-time-range',
  templateUrl: './time-range.component.html',
  styleUrls: ['./time-range.component.css']
})
export class TimeRangeComponent implements OnInit {
  @Input() timeRange: TimeRange;
  
  constructor() { }

  ngOnInit() {
  }

}
