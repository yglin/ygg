import { PageObject } from '@ygg/shared/test/page-object';
import { DayTimeViewPageObject } from '../../day-time';
import { DayTime } from '@ygg/shared/omni-types/core';
import { DateViewPageObject } from '../../date';

export abstract class DatetimeViewPageObject extends PageObject {
  selectors = {
    main: '.datetime-view',
    date: '.date',
    dayTime: '.day-time'
  };

  dateViewPO: DateViewPageObject;
  dayTimeViewPO: DayTimeViewPageObject;

  expectValue(datetime: Date) {
    this.dateViewPO.expectValue(datetime);
    this.dayTimeViewPO.expectValue(DayTime.fromDate(datetime));
  }
}
