import { MyThingsDataTablePageObject } from '@ygg/the-thing/ui';
import { TheThingDataTablePageObjectCypress } from './the-thing-data-table.po';
import { TheThing } from '@ygg/the-thing/core';

export class MyThingsDataTablePageObjectCypress extends MyThingsDataTablePageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.theThingDataTablePO = new TheThingDataTablePageObjectCypress(
      this.getSelector()
    );
  }

  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector()).should('be.visible');
  }

  clickCreate() {
    cy.get(this.getSelector('buttonCreate')).click();
  }

  deleteAll() {
    cy.wait(5000);
    this.theThingDataTablePO.expectNotEmpty();
    this.theThingDataTablePO.selectAll();
    cy.get(this.getSelector('buttonDeleteSelection'), {
      timeout: 10000
    }).click();
    this.theThingDataTablePO.expectEmpty();
  }

  deleteSelection(selection: TheThing[]) {
    this.theThingDataTablePO.select(selection);
    cy.get(this.getSelector('buttonDeleteSelection')).click();
    this.theThingDataTablePO.expectNotTheThing(selection);
  }
}
