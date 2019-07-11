import { Component, Input } from '@angular/core';
import { DateRange } from './date-range';

@Component({
  selector: 'ygg-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.css']
})
export class DateRangeComponent {
  @Input() dateRange: DateRange;

  constructor() { }
}
