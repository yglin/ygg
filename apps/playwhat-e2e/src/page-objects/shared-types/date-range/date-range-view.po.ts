import { DateRangeViewPageObject, DateRange, DATE_FORMATS } from "@ygg/shared/types";
import * as moment from 'moment';

export class DateRangeViewPageObjectCypress extends DateRangeViewPageObject {
  expectValue(dateRange: DateRange) {
    const startText = moment(dateRange.start).format(DATE_FORMATS.display.date);
    const endText = moment(dateRange.end).format(DATE_FORMATS.display.date);
    cy.get(this.getSelector('start')).contains(startText);
    cy.get(this.getSelector('end')).contains(endText);
  }
}