import { PageObject } from '@ygg/shared/test/page-object';
import { DayTimeRange } from './day-time-range';
import { DayTimeViewPageObject } from "../day-time";

export class DayTimeRangePageObject extends PageObject {
  selectors = {
    main: '.day-time-range',
    start: '.start',
    end: '.end'
  };

  startDayTimePageObject: DayTimeViewPageObject;
  endDayTimePageObject: DayTimeViewPageObject;

  expectValue(dayTimeRange: DayTimeRange) {
    this.startDayTimePageObject.expectValue(dayTimeRange.start);
    this.endDayTimePageObject.expectValue(dayTimeRange.end);
  }
}