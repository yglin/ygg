import { PageObject } from '@ygg/shared/test/page-object';
import { TimeRange } from '@ygg/shared/omni-types/core';
import { DayTimeControlPageObject } from '../../day-time';

export abstract class TimeRangeControlPageObject extends PageObject {
  selectors = {
    main: '.ygg-time-range-control',
    inputStartDate: 'input.start-date',
    inputEndDate: 'input.end-date',
    inputStartDayTime: '.start-day-time',
    inputEndDayTime: '.end-day-time'
  };

  startDayTimeControlPO: DayTimeControlPageObject;
  endDayTimeControlPO: DayTimeControlPageObject;

  abstract setValue(TimeRange: TimeRange): any;
}
