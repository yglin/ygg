import { PageObject } from '@ygg/shared/test/page-object';
import { DayTimeRange } from '@ygg/shared/omni-types/core';
import { DayTimeViewPageObject } from "../../day-time";

export class DayTimeRangeViewPageObject extends PageObject {
  selectors = {
    main: '.day-time-range-view',
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