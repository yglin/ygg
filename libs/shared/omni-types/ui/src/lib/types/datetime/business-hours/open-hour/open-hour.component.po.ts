import { PageObject } from '@ygg/shared/test/page-object';
import { DayTimeRangeViewPageObject } from '../../day-time-range';
import { OpenHour } from '@ygg/shared/omni-types/core';

export abstract class OpenHourViewPageObject extends PageObject {
  selectors = {
    main: '.open-hour',
    weekDay: '.week-day',
    dayTimeRange: '.day-time-range'
  };

  dayTimeRangePO: DayTimeRangeViewPageObject;

  abstract expectValue(openHour: OpenHour);
}
