import { TimeRange, DATE_FORMATS, DayTime } from '@ygg/shared/omni-types/core';
import { TimeRangeViewPageObject } from '@ygg/shared/omni-types/ui';
import * as moment from 'moment';
import { DayTimeViewPageObjectCypress } from '../day-time';

export class TimeRangeViewPageObjectCypress extends TimeRangeViewPageObject {

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.startDayTimePO = new DayTimeViewPageObjectCypress(this.getSelector('startDayTime'));
    this.endDayTimePO = new DayTimeViewPageObjectCypress(this.getSelector('endDayTime'));
  }

  expectValue(timeRange: TimeRange) {
    const startDate = moment(timeRange.start).format(DATE_FORMATS.display.date);
    const endDate = moment(timeRange.end).format(DATE_FORMATS.display.date);
    cy.get(this.getSelector('startDate')).should('include.text', startDate);
    if (endDate !== startDate) {
      cy.get(this.getSelector('endDate')).should('include.text', endDate);
    }
    const startDayTime = new DayTime(timeRange.start.getHours(), timeRange.start.getMinutes());
    this.startDayTimePO.expectValue(startDayTime);

    const endDayTime = new DayTime(timeRange.end.getHours(), timeRange.end.getMinutes());
    this.endDayTimePO.expectValue(endDayTime);
  }
}
