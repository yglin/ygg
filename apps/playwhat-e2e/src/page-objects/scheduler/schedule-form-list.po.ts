import { ScheduleForm } from '@ygg/playwhat/scheduler';
import { ScheduleFormListPageObject } from "@ygg/playwhat/scheduler";

export class ScheduleFormListPageObjectCypress extends ScheduleFormListPageObject {
  
  expectScheduleForm(scheduleForm: ScheduleForm) {
    cy.log(`Schedule form id = ${scheduleForm.id}`);
    cy.get(this.getSelectorForScheduleForm(scheduleForm)).should('exist');
  }

  viewScheduleForm(scheduleForm: ScheduleForm) {
    cy.get(this.getSelectorForScheduleForm(scheduleForm)).click();
  }
}