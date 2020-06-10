import { PlayAdminPageObject } from '@ygg/playwhat/admin';
import { IncomeDataTablePageObjectCypress } from '@ygg/shopping/test';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingDataTablePageObjectCypress } from '@ygg/the-thing/test';
import { ImitationPlay } from '@ygg/playwhat/core';
import { values, omit, pick } from 'lodash';
import { Month } from '@ygg/shared/omni-types/core';

export class PlayAdminPageObjectCypress extends PlayAdminPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    for (const state of values(
      pick(ImitationPlay.states, ['assess', 'forSale'])
    )) {
      this.theThingDataTables[
        state.name
      ] = new TheThingDataTablePageObjectCypress(
        this.getSelectorForTabContent(state.name),
        ImitationPlay
      );
    }
  }

  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  switchToTab(tabName: string): void {
    cy.get(this.getSelectorForTabHeader(tabName)).click();
  }

  selectMonth(month: Month) {
    cy.get(this.getSelector('selectMonth')).select(month.displayName);
  }
}
