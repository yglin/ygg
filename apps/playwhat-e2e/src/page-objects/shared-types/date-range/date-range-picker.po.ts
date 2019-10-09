import * as moment from 'moment';
import { DateRange } from '@ygg/shared/types';
import { DateRangePickerPageObject } from '@ygg/shared/types';

export class DateRangePickerPageObjectCypress extends DateRangePickerPageObject {
  setValue(dateRange: DateRange) {
    cy.get(this.getSelector('inputStart')).clear().type(moment(dateRange.start).format(DateRange.format));
    cy.get(this.getSelector('inputEnd')).clear().type(moment(dateRange.end).format(DateRange.format));
  }
}