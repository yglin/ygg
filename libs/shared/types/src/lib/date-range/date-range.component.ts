import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DateRange, DATE_FORMATS } from './date-range';
import * as moment from 'moment';

@Component({
  selector: 'ygg-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.css']
})
export class DateRangeComponent implements OnChanges {
  @Input() dateRange: DateRange;
  startText = '';
  endText = '';

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    const newDateRange = changes.dateRange.currentValue;
    if (DateRange.isDateRange(newDateRange)) {
      // console.log(newDateRange.start);
      // console.log(newDateRange.end);
      this.startText = moment(newDateRange.start).format(DATE_FORMATS.display.date);
      this.endText = moment(newDateRange.end).format(DATE_FORMATS.display.date);
    } else {
      this.startText = '';
      this.endText = '';
    }
  }
}
