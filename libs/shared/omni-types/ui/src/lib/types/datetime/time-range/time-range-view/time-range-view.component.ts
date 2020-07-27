import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TimeRange, DayTime } from '@ygg/shared/omni-types/core';
import { DATE_FORMATS } from '@ygg/shared/omni-types/core';
import * as moment from 'moment';

@Component({
  selector: 'ygg-time-range-view',
  templateUrl: './time-range-view.component.html',
  styleUrls: ['./time-range-view.component.css']
})
export class TimeRangeViewComponent implements OnChanges {
  @Input() timeRange: TimeRange;
  startDate: string;
  endDate: string;
  startDayTime: DayTime;
  endDayTime: DayTime;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    const newTimeRange = changes.timeRange.currentValue;
    // console.log(newTimeRange);
    // console.log(TimeRange.isTimeRange(newTimeRange));
    if (TimeRange.isTimeRange(newTimeRange)) {
      this.startDate = moment(newTimeRange.start).format(
        DATE_FORMATS.display.date
      );
      this.endDate = moment(newTimeRange.end).format(DATE_FORMATS.display.date);
      if (this.endDate === this.startDate) {
        this.endDate = null;
      }
      this.startDayTime = new DayTime(
        newTimeRange.start.getHours(),
        newTimeRange.start.getMinutes()
      );
      this.endDayTime = new DayTime(
        newTimeRange.end.getHours(),
        newTimeRange.end.getMinutes()
      );
    }
  }
}
