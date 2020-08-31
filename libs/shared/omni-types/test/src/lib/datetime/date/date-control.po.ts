import { DateControlPageObject } from '@ygg/shared/omni-types/ui';
import * as moment from 'moment';
import { DATE_FORMATS } from '@ygg/shared/omni-types/core';

export class DateControlPageObjectCypress extends DateControlPageObject {
  setValue(date: Date): void {
    cy.get(this.getSelector('inputDate'))
      .clear()
      .type(moment(date).format(DATE_FORMATS.parse.dateInput[0]));
  }
}
