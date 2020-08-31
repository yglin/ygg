import { DatetimeViewPageObject } from '@ygg/shared/omni-types/ui';
import { DateViewPageObjectCypress } from '../date/date-view.po';
import { DayTimeViewPageObjectCypress } from '../day-time';

export class DatetimeViewPageObjectCypress extends DatetimeViewPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.dateViewPO = new DateViewPageObjectCypress(this.getSelector('date'));
    this.dayTimeViewPO = new DayTimeViewPageObjectCypress(
      this.getSelector('dayTime')
    );
  }
}
