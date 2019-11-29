import { DayTimeRange, DayTimeRangeControlPageObject } from '@ygg/shared/types';
import { DayTimeControlPageObjectCypress } from "../day-time";

export class DayTimeRangeControlPageObjectCypress extends DayTimeRangeControlPageObject {
  constructor(parentString: string) {
    super(parentString);
    this.startDayTimeControl = new DayTimeControlPageObjectCypress(this.getSelector('start'));
    this.endDayTimeControl = new DayTimeControlPageObjectCypress(this.getSelector('end'));
  }
}