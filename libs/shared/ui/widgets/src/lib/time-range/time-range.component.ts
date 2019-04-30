import { Component, Input } from '@angular/core';

@Component({
  selector: 'ygg-time-range',
  templateUrl: './time-range.component.html',
  styleUrls: ['./time-range.component.css']
})
export class TimeRangeComponent {
  @Input() start: Date;
  @Input() end: Date;

  constructor() { }
}
