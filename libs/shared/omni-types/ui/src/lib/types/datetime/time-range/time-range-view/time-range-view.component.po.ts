import { PageObject } from '@ygg/shared/test/page-object';
import { TimeRange } from '@ygg/shared/omni-types/core';
import { DayTimeViewPageObject } from '../../day-time';

export abstract class TimeRangeViewPageObject extends PageObject {
  selectors = {
    main: '.time-range-view',
    startDate: '.start-date',
    endDate: '.end-date',
    startDayTime: '.start-day-time',
    endDayTime: '.end-day-time'
  };

  startDayTimePO: DayTimeViewPageObject;
  endDayTimePO: DayTimeViewPageObject;

  abstract expectValue(TimeRange: TimeRange);
}
