import * as moment from 'moment';
import { TimeRange, DATE_FORMATS, DayTime } from '@ygg/shared/omni-types/core';
import { TimeRangeControlPageObject } from '@ygg/shared/omni-types/ui';
import { DayTimeControlPageObjectCypress } from '../day-time';

export class TimeRangeControlPageObjectCypress extends TimeRangeControlPageObject {
  // expectValue(timeRange: TimeRange) {
  //   cy.get(this.getSelector('inputStartDate'))
  //     .invoke('val')
  //     .should(
  //       'equal',
  //       moment(timeRange.start).format(DATE_FORMATS.parse.dateInput[0])
  //     );
  //   cy.get(this.getSelector('inputEndDate'))
  //     .invoke('val')
  //     .should(
  //       'equal',
  //       moment(timeRange.end).format(DATE_FORMATS.parse.dateInput[0])
  //     );
  // }

  constructor(parentSelector?: string) {
    super(parentSelector);

    this.startDayTimeControlPO = new DayTimeControlPageObjectCypress(
      this.getSelector('inputStartDayTime')
    );
    this.endDayTimeControlPO = new DayTimeControlPageObjectCypress(
      this.getSelector('inputEndDayTime')
    );
  }

  setValue(timeRange: TimeRange) {
    cy.get(this.getSelector('inputStartDate')).clear();
    cy.get(this.getSelector('inputEndDate')).clear();
    cy.get(this.getSelector('inputStartDate')).type(
      moment(timeRange.start).format(DATE_FORMATS.parse.dateInput[0])
    );
    cy.get(this.getSelector('inputEndDate')).type(
      moment(timeRange.end).format(DATE_FORMATS.parse.dateInput[0])
    );

    const startDayTime = DayTime.fromDate(timeRange.start);
    this.startDayTimeControlPO.setValue(startDayTime);

    const endDayTime = DayTime.fromDate(timeRange.end);
    this.endDayTimeControlPO.setValue(endDayTime);
  }
}
