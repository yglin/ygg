import { DateRange } from "@ygg/shared/omni-types/core";
import { TheThing } from '@ygg/the-thing/core';
import { TourPlanViewPageObject } from '@ygg/playwhat/tour';
import { DateRangeViewPageObjectCypress } from '@ygg/shared/omni-types/test';

export class TourPlanViewPageObjectCypress extends TourPlanViewPageObject {
  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  expectValue(tourPlan: TheThing) {
    cy.get(this.getSelector('name')).should('include.text', tourPlan.name);

    const dateRangeViewPO = new DateRangeViewPageObjectCypress();
    const dateRange: DateRange = tourPlan.cells['預計出遊日期'].value;
    dateRangeViewPO.expectValue(dateRange);
  }
}
