import { PageObject } from '@ygg/shared/test/page-object';
import { DayTimeControlPageObject } from '../../day-time';
import { DateControlPageObject } from '../../date/date-control/date-control.component.po';
import { DayTime } from '@ygg/shared/omni-types/core';

export abstract class DatetimeControlPageObject extends PageObject {
  selectors = {
    main: '.datetime-control',
    dateControl: '.date-control',
    dayTimeControl: '.day-time-control'
  };

  dateControlPO: DateControlPageObject;
  dayTimeControlPO: DayTimeControlPageObject;

  setValue(datetime: Date) {
    this.dateControlPO.setValue(datetime);
    this.dayTimeControlPO.setValue(DayTime.fromDate(datetime));
  }
}
