import * as moment from 'moment';
import { DateRange, DATE_FORMATS } from '@ygg/shared/types';
import { DateRangeControlPageObject } from '@ygg/shared/types';

export class DateRangeControlPageObjectCypress extends DateRangeControlPageObject {
  setValue(dateRange: DateRange) {
    cy.get(this.getSelector('inputStart')).clear();
    cy.get(this.getSelector('inputEnd')).clear();
    cy.get(this.getSelector('inputStart')).type(moment(dateRange.start).format(DATE_FORMATS.parse.dateInput[0]));
    cy.get(this.getSelector('inputEnd')).type(moment(dateRange.end).format(DATE_FORMATS.parse.dateInput[0]));
  }
}