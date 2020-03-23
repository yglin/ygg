import { TourPlanAdminPageObject } from '@ygg/playwhat/admin';
import { IncomeDataTablePageObjectCypress } from '@ygg/shopping/test';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingDataTablePageObjectCypress } from '@ygg/the-thing/test';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import { ImitationOrder } from '@ygg/shopping/core';

export class TourPlanAdminPageObjectCypress extends TourPlanAdminPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.inApplicationsDataTablePO = new TheThingDataTablePageObjectCypress(
      this.getSelectorForTabContent(ImitationOrder.states.applied.name),
      ImitationTourPlan
    );
    this.paidDataTablePO = new TheThingDataTablePageObjectCypress(
      this.getSelectorForTabContent(ImitationOrder.states.paid.name),
      ImitationTourPlan
    );
    this.completedDataTablePO = new TheThingDataTablePageObjectCypress(
      this.getSelectorForTabContent(ImitationOrder.states.completed.name),
      ImitationTourPlan
    );
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
}
