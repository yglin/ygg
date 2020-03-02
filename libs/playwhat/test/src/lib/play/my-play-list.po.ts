import { MyPlayListPageObject } from '@ygg/playwhat/ui';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingDataTablePageObjectCypress } from '@ygg/the-thing/test';

export class MyPlayListPageObjectCypress extends MyPlayListPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.theThingDataTablePO = new TheThingDataTablePageObjectCypress(
      this.getSelector('dataTable')
    );
  }

  clickCreate(): void {
    cy.get(this.getSelector('buttonCreate')).click();
  }

  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }
}
