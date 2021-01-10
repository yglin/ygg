import { TimeRange } from '@ygg/shared/omni-types/core';
import { ControlPageObject } from '@ygg/shared/test/page-object';
import { DayTimeControlPageObject } from '../../day-time';

export abstract class TimeRangeControlPageObject extends ControlPageObject {
  selectors = {
    main: '.ygg-time-range-control',
    inputStartDate: 'input.start-date',
    inputEndDate: 'input.end-date',
    inputStartDayTime: '.start-day-time',
    inputEndDayTime: '.end-day-time'
  };

  startDayTimeControlPO: DayTimeControlPageObject;
  endDayTimeControlPO: DayTimeControlPageObject;

  abstract setValue(timeRange: TimeRange): any;
}
