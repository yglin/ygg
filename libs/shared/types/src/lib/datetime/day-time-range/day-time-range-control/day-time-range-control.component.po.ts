import { PageObject } from '@ygg/shared/test/page-object';
import { DayTimeRange } from '../day-time-range';
import { DayTimeControlPageObject } from "../../day-time";

export class DayTimeRangeControlPageObject extends PageObject {
  selectors = {
    main: '.day-time-range-control',
    start: '#start',
    end: '#end'
  };
  startDayTimeControl: DayTimeControlPageObject;
  endDayTimeControl: DayTimeControlPageObject;

  setValue(dayTimeRange: DayTimeRange) {
    this.startDayTimeControl.setValue(dayTimeRange.start);
    this.endDayTimeControl.setValue(dayTimeRange.end);
  }
}