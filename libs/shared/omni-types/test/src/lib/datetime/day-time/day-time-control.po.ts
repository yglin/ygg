import { DayTime } from '@ygg/shared/omni-types/core';
import { DayTimeControlPageObject } from '@ygg/shared/omni-types/ui';

export class DayTimeControlPageObjectCypress extends DayTimeControlPageObject {
  setValue(dayTime: DayTime) {
    cy.get(this.getSelector('inputHour'))
      .clear()
      .type(dayTime.hour.toString());
    cy.get(this.getSelector('inputMinute'))
      .clear()
      .type(dayTime.minute.toString());
  }

  expectValue(dayTime: DayTime) {
    cy.get(this.getSelector('inputHour'))
      .invoke('val')
      .should('equal', dayTime.hour.toString());
    cy.get(this.getSelector('inputMinute'))
      .invoke('val')
      .should('equal', dayTime.minute.toString());
  }
}
