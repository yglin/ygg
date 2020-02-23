import * as moment from 'moment';
import { DateRange, DATE_FORMATS } from '@ygg/shared/omni-types/core';
import { DateRangeControlPageObject } from '@ygg/shared/omni-types/ui';

export class DateRangeControlPageObjectCypress extends DateRangeControlPageObject {
  expectValue(dateRange: DateRange) {
    cy.get(this.getSelector('inputStart'))
      .invoke('val')
      .should(
        'equal',
        moment(dateRange.start).format(DATE_FORMATS.parse.dateInput[0])
      );
    cy.get(this.getSelector('inputEnd'))
      .invoke('val')
      .should(
        'equal',
        moment(dateRange.end).format(DATE_FORMATS.parse.dateInput[0])
      );
  }

  setValue(dateRange: DateRange) {
    cy.get(this.getSelector('inputStart')).clear();
    cy.get(this.getSelector('inputEnd')).clear();
    cy.get(this.getSelector('inputStart')).type(
      moment(dateRange.start).format(DATE_FORMATS.parse.dateInput[0])
    );
    cy.get(this.getSelector('inputEnd')).type(
      moment(dateRange.end).format(DATE_FORMATS.parse.dateInput[0])
    );
  }
}
