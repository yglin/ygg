import { ScheduleFormViewPagePageObject } from "@ygg/playwhat/scheduler";

export class ScheduleFormViewPagePageObjectCypress extends ScheduleFormViewPagePageObject {

  gotoEdit() {
    cy.get(this.getSelector('buttonEdit')).click();
  }
}