import { DateViewPageObject } from '@ygg/shared/omni-types/ui';
import * as moment from 'moment';
import { DATE_FORMATS } from '@ygg/shared/omni-types/core';

export class DateViewPageObjectCypress extends DateViewPageObject {
  expectValue(date: Date): void {
    const dateText = moment(date).format(DATE_FORMATS.display.date);
    cy.get(this.getSelector()).should('include.text', dateText);
  }
}
