import { DayTimeRangePageObject } from "@ygg/shared/types";
import { DayTimeViewPageObjectCypress } from "../day-time";

export class DayTimeRangeViewPageObjectCypress extends DayTimeRangePageObject {
  constructor(parentSelector: string) {
    super(parentSelector);
    this.startDayTimePageObject = new DayTimeViewPageObjectCypress(this.getSelector('start'));
    this.endDayTimePageObject = new DayTimeViewPageObjectCypress(this.getSelector('end'));
  }
}