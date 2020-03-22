import { TourPlanAdminPageObject } from '@ygg/playwhat/admin';
import { IncomeDataTablePageObjectCypress } from '@ygg/shopping/test';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingDataTablePageObjectCypress } from '@ygg/the-thing/test';
import { ImitationTourPlan } from '@ygg/playwhat/core';

export class TourPlanAdminPageObjectCypress extends TourPlanAdminPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.inApplicationsDataTablePO = new TheThingDataTablePageObjectCypress(
      this.getSelectorForTabContent(
        TourPlanAdminPageObject.TabNames.inApplication
      ),
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

  gotoView(tourPlan: TheThing) {
    this.switchToTab(TourPlanAdminPageObject.TabNames.inApplication);
    this.inApplicationsDataTablePO.gotoTheThingView(tourPlan);
  }
}
