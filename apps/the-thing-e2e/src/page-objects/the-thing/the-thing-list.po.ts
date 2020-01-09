import { TheThing } from '@ygg/the-thing/core';
import { TheThingListPageObject } from '@ygg/the-thing/ui';

export class TheThingListPageObjectCypress extends TheThingListPageObject {
  expectTheThing(theThing: TheThing) {
    cy.get(this.getSelectorForTheThing(theThing)).should('exist');
  }

  expectNoTheThing(theThing: TheThing) {
    cy.get(this.getSelectorForTheThing(theThing)).should('not.exist');
  }

  deleteTheThing(theThing: TheThing) {
    cy.get(this.getSelectorForTheThingDelete(theThing)).click({ force: true });
  }
}
