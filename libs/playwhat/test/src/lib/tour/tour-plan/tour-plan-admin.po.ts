import { TourPlanAdminPageObject } from '@ygg/playwhat/admin';
import { IncomeDataTablePageObjectCypress } from '@ygg/shopping/test';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingDataTablePageObjectCypress } from '@ygg/the-thing/test';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import { ImitationOrder } from '@ygg/shopping/core';
import { values, omit } from 'lodash';
import { Month } from '@ygg/shared/omni-types/core';

export class TourPlanAdminPageObjectCypress extends TourPlanAdminPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    for (const state of values(omit(ImitationOrder.states, 'new'))) {
      this.theThingDataTables[
        state.name
      ] = new TheThingDataTablePageObjectCypress(
        this.getSelectorForTabContent(state.name),
        ImitationTourPlan
      );
    }
    this.incomeDataTablePO = new IncomeDataTablePageObjectCypress(
      this.getSelectorForTabContent(
        TourPlanAdminPageObject.TabNames.incomeRecords
      )
    );
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
