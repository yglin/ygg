import { OpenHourViewPageObject } from '@ygg/shared/omni-types/ui';
import { OpenHour, getWeekDayName } from '@ygg/shared/omni-types/core';
import { DayTimeRangeViewPageObjectCypress } from '../day-time-range';

export class OpenHourViewPageObjectCypress extends OpenHourViewPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.dayTimeRangePO = new DayTimeRangeViewPageObjectCypress(
      this.getSelector('dayTimeRange')
    );
  }
  
  expectValue(openHour: OpenHour) {
    cy.get(this.getSelector('weekDay')).contains(
      getWeekDayName(openHour.weekDay)
    );
    this.dayTimeRangePO.expectValue(openHour.dayTimeRange);
  }
}
