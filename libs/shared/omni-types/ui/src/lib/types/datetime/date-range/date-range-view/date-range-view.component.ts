import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DateRange } from '@ygg/shared/omni-types/core';
import { DATE_FORMATS } from '@ygg/shared/omni-types/core';
import * as moment from 'moment';

@Component({
  selector: 'ygg-date-range-view',
  templateUrl: './date-range-view.component.html',
  styleUrls: ['./date-range-view.component.css']
})
export class DateRangeViewComponent implements OnChanges {
  @Input() dateRange: DateRange;
  startText = '';
  endText = '';

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    const newDateRange = changes.dateRange.currentValue;
    // console.log(newDateRange);
    // console.log(DateRange.isDateRange(newDateRange));
    if (DateRange.isDateRange(newDateRange)) {
      this.startText = moment(newDateRange.start).format(DATE_FORMATS.display.date);
      this.endText = moment(newDateRange.end).format(DATE_FORMATS.display.date);
    } else {
      this.startText = '';
      this.endText = '';
    }
  }
}
