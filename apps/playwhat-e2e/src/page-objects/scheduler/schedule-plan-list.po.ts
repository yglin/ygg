import { SchedulePlan } from '@ygg/playwhat/scheduler';
import { SchedulePlanListPageObject } from "@ygg/playwhat/scheduler";

export class SchedulePlanListPageObjectCypress extends SchedulePlanListPageObject {
  
  expectSchedulePlan(schedulePlan: SchedulePlan) {
    cy.log(`Schedule form id = ${schedulePlan.id}`);
    cy.get(this.getSelectorForSchedulePlan(schedulePlan)).should('exist');
  }

  viewSchedulePlan(schedulePlan: SchedulePlan) {
    cy.get(this.getSelectorForSchedulePlan(schedulePlan)).click();
  }
}