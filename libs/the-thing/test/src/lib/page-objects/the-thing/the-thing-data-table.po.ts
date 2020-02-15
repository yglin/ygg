import { TheThingDataTablePageObject } from '@ygg/the-thing/ui';
import { TheThing } from '@ygg/the-thing/core';
import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class TheThingDataTablePageObjectCypress extends TheThingDataTablePageObject implements PageObjectCypress {
  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector()).should('be.visible');
  }

  expectTheThing(theThing: TheThing) {
    cy.get(this.getSelectorForTheThing(theThing)).should('exist');
  }

  clickTheThing(theThing: TheThing) {
    cy.get(this.getSelectorForTheThing(theThing)).click();
  }

  clickFirst() {
    cy.get(this.getSelectorForFirst()).click();
  }
}
