import { DayTimeRange } from '@ygg/shared/omni-types/core';
import { DayTimeRangeControlPageObject } from "@ygg/shared/omni-types/ui";
import { DayTimeControlPageObjectCypress } from "../day-time";

export class DayTimeRangeControlPageObjectCypress extends DayTimeRangeControlPageObject {
  constructor(parentString: string) {
    super(parentString);
    this.startDayTimeControl = new DayTimeControlPageObjectCypress(this.getSelector('start'));
    this.endDayTimeControl = new DayTimeControlPageObjectCypress(this.getSelector('end'));
  }

  expectValue(dayTimeRange: DayTimeRange) {
    this.startDayTimeControl.expectValue(dayTimeRange.start);
    this.endDayTimeControl.expectValue(dayTimeRange.end);
  }
}