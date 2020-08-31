import { DatetimeControlPageObject } from '@ygg/shared/omni-types/ui';
import { DayTimeControlPageObjectCypress } from '../day-time';
import { DateControlPageObjectCypress } from '../date';

export class DatetimeControlPageObjectCypress extends DatetimeControlPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.dateControlPO = new DateControlPageObjectCypress(
      this.getSelector('dateControl')
    );
    this.dayTimeControlPO = new DayTimeControlPageObjectCypress(
      this.getSelector('dayTimeControl')
    );
  }
}
