import { SchedulePlanViewPagePageObject } from "@ygg/schedule/ui";

export class SchedulePlanViewPagePageObjectCypress extends SchedulePlanViewPagePageObject {

  gotoEdit() {
    cy.get(this.getSelector('buttonEdit')).click();
  }

  createSchedule() {
    cy.get(this.getSelector('buttonCreateSchedule')).click();
  }
}