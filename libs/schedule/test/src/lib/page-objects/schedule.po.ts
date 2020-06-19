import { SchedulePageObject } from '@ygg/schedule/ui';
import { Schedule } from '@ygg/schedule/core';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';

export class SchedulePageObjectCypress extends SchedulePageObject {
  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  expectSchedule(schedule: Schedule) {}

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click();
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm('行程安排完成，送出此行程表？');
  }
}
