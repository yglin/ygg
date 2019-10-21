import { ScheduleForm } from '@ygg/playwhat/scheduler';

export * from './schedule-form.po';
export * from './schedule-form-view.po';
export * from './schedule-form-list.po';

export function deleteScheduleForm(scheduleForm: ScheduleForm) {
  // @ts-ignore
  cy.callFirestore('delete', `schedule-forms/${scheduleForm.id}`);
}

