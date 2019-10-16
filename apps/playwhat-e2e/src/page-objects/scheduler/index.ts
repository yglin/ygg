import { ScheduleForm } from '@ygg/playwhat/scheduler';

export * from './schedule-form.po';
export * from './schedule-form-view.po';

export function deleteScheduleForm(scheduleForm: ScheduleForm) {
  // @ts-ignore
  cy.callFirestore('delete', `schedule-forms/${scheduleForm.id}`);
  // delete play tags
  cy.wrap(scheduleForm.tags.toTagsArray()).each((element, index, array) => {
    // @ts-ignore
    cy.callFirestore('delete', `tags/${(element as Tag).id}`);
  });    

}

