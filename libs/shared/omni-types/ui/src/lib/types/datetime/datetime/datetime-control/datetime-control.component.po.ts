import { DayTime } from '@ygg/shared/omni-types/core';
import { ControlPageObject } from '@ygg/shared/test/page-object';
import { DateControlPageObject } from '../../date/date-control/date-control.component.po';
import { DayTimeControlPageObject } from '../../day-time';

export abstract class DatetimeControlPageObject extends ControlPageObject {
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
