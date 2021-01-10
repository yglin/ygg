import { DayTimeRange } from '@ygg/shared/omni-types/core';
import { ControlPageObject } from '@ygg/shared/test/page-object';
import { DayTimeControlPageObject } from '../../day-time';

export class DayTimeRangeControlPageObject extends ControlPageObject {
  selectors = {
    main: '.day-time-range-control',
    start: '#start',
    end: '#end'
  };
  startDayTimeControl: DayTimeControlPageObject;
  endDayTimeControl: DayTimeControlPageObject;

  setValue(dayTimeRange: DayTimeRange) {
    // console.log(dayTimeRange);
    this.startDayTimeControl.setValue(dayTimeRange.start);
    this.endDayTimeControl.setValue(dayTimeRange.end);
  }
}
