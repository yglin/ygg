import { DayTimeRangeViewPageObject } from "@ygg/shared/omni-types/ui";
import { DayTimeViewPageObjectCypress } from "../day-time";

export class DayTimeRangeViewPageObjectCypress extends DayTimeRangeViewPageObject {
  constructor(parentSelector: string) {
    super(parentSelector);
    this.startDayTimePageObject = new DayTimeViewPageObjectCypress(this.getSelector('start'));
    this.endDayTimePageObject = new DayTimeViewPageObjectCypress(this.getSelector('end'));
  }
}