import { SchedulePlanViewPagePageObject } from "@ygg/playwhat/scheduler";

export class SchedulePlanViewPagePageObjectCypress extends SchedulePlanViewPagePageObject {

  gotoEdit() {
    cy.get(this.getSelector('buttonEdit')).click();
  }

  createSchedule() {

  }
}