import { DateRange, DATE_FORMATS } from '@ygg/shared/omni-types/core';
import { DateRangeViewPageObject } from '@ygg/shared/omni-types/ui';
import * as moment from 'moment';

export class DateRangeViewPageObjectCypress extends DateRangeViewPageObject {
  expectValue(dateRange: DateRange) {
    const startText = moment(dateRange.start).format(DATE_FORMATS.display.date);
    const endText = moment(dateRange.end).format(DATE_FORMATS.display.date);
    cy.get(this.getSelector('start')).should('include.text', startText);
    cy.get(this.getSelector('end')).should('include.text', endText);
  }
}
