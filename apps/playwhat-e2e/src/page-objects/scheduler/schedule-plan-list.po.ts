import { SchedulePlan } from '@ygg/schedule/core';
import { SchedulePlanListPageObject } from "@ygg/schedule/ui";

export class SchedulePlanListPageObjectCypress extends SchedulePlanListPageObject {
  
  expectSchedulePlan(schedulePlan: SchedulePlan) {
    cy.log(`Schedule form id = ${schedulePlan.id}`);
    cy.get(this.getSelectorForSchedulePlan(schedulePlan)).should('exist');
  }

  viewSchedulePlan(schedulePlan: SchedulePlan) {
    cy.get(this.getSelectorForSchedulePlan(schedulePlan)).click();
  }
}