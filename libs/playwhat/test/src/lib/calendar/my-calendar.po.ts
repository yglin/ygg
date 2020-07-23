import { MyCalendarPageObject } from '@ygg/playwhat/ui';

export class MyCalendarPageObjectCypress extends MyCalendarPageObject {
  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }
}
