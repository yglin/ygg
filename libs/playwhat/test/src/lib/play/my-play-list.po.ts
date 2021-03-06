import { MyPlayListPageObject } from '@ygg/playwhat/ui';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingDataTablePageObjectCypress, MyThingsDataTablePageObjectCypress } from '@ygg/the-thing/test';
import { ImitationPlay } from '@ygg/playwhat/core';

export class MyPlayListPageObjectCypress extends MyPlayListPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.myPlaysDataTablePO = new MyThingsDataTablePageObjectCypress(
      this.getSelector('dataTable'), ImitationPlay
    );
  }

  clickCreate(): void {
    cy.get(this.getSelector('buttonCreate')).click();
  }

  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

}
