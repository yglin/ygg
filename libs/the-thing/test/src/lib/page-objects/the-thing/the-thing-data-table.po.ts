import { TheThingDataTablePageObject } from '@ygg/the-thing/ui';
import { TheThing } from '@ygg/the-thing/core';
import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class TheThingDataTablePageObjectCypress
  extends TheThingDataTablePageObject
  implements PageObjectCypress {
  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector()).should('be.visible');
  }

  setSearchText(text: string) {
    cy.get(this.getSelector('inputSearch'))
      .clear()
      .type(text);
  }

  expectTheThing(theThing: TheThing) {
    this.setSearchText(theThing.name);
    cy.get(`${this.getSelector()} tr`)
      .contains(theThing.name)
      .should('exist');
  }

  expectNotTheThing(theThing: TheThing) {
    this.setSearchText(theThing.name);
    cy.get(`${this.getSelector()} tr`)
      .contains(theThing.name)
      .should('not.exist');
  }

  deleteTheThing(theThing: TheThing) {
    this.setSearchText(theThing.name);
    cy.get(`${this.getSelector()}`)
      .contains('tr', theThing.name).find('button.delete').click();
  }

  clickTheThing(theThing: TheThing) {
    cy.get(`${this.getSelector()} tr`)
      .contains(theThing.name)
      .click();
  }

  clickFirst() {
    cy.get(this.getSelectorForFirst()).click();
  }
}
