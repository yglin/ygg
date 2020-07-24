import { MyCalendarPageObject } from '@ygg/playwhat/ui';
import { TheThing } from '@ygg/the-thing/core';

export class MyCalendarPageObjectCypress extends MyCalendarPageObject {
  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  expectEvent(testEvent: TheThing) {
    cy.get(`${this.getSelector()} .cal-event-title`)
      .contains(testEvent.name)
      .scrollIntoView()
      .should('be.visible');
  }

  clickEvent(testEvent: TheThing) {
    cy.get(`${this.getSelector()} .cal-event-title`)
      .contains(testEvent.name)
      .scrollIntoView()
      .click();
  }
}
