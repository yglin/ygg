import { SchedulePageObject } from '@ygg/schedule/ui';
import { Schedule } from '@ygg/schedule/core';

export class SchedulePageObjectCypress extends SchedulePageObject {
  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }
  expectSchedule(schedule: Schedule) {
    
  }
}
