import { DateRange } from '@ygg/shared/types';
import { DateRangePickerPageObject } from '@ygg/shared/types';

export class DateRangePickerPageObjectCypress extends DateRangePickerPageObject {
  
  setValue(dateRange: DateRange) {
    cy.get(this.getSelector('inputStart')).type(dateRange.start.toISOString().split('T')[0]);
    cy.get(this.getSelector('inputEnd')).type(dateRange.end.toISOString().split('T')[0]);
  }
}