import * as moment from 'moment';
import { DateRange, DATE_FORMATS } from '@ygg/shared/types';
import { DateRangePickerPageObject } from '@ygg/shared/types';

export class DateRangePickerPageObjectCypress extends DateRangePickerPageObject {
  setValue(dateRange: DateRange) {
    cy.get(this.getSelector('inputStart')).clear().type(moment(dateRange.start).format(DATE_FORMATS.parse.dateInput[0]));
    cy.get(this.getSelector('inputEnd')).clear().type(moment(dateRange.end).format(DATE_FORMATS.parse.dateInput[0]));
  }
}