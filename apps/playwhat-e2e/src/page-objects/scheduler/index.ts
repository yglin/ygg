import { last } from "lodash";
import { ScheduleForm } from '@ygg/playwhat/scheduler';
import { SiteNavigator } from '../site-navigator';
import { ScheduleFormPageObjectCypress } from "./schedule-form.po";
import { ScheduleFormListPageObjectCypress } from './schedule-form-list.po';

export * from './schedule-form.po';
export * from './schedule-form-view.po';
export * from './schedule-form-list.po';

const siteNavigator = new SiteNavigator();

export function createScheduleForm(scheduleForm: ScheduleForm): Cypress.Chainable<any> {
  siteNavigator.goto(['scheduler', 'new']);

  // XXX Debug number-range input
  // testScheduleForm.singleBudget.min = 0;
  // testScheduleForm.singleBudget.max = 500;
  // testScheduleForm.totalBudget.min = 3068;
  // testScheduleForm.totalBudget.max = 54088
  // XXX End

  cy.log('##### Create test schedule form #####');
  const scheduleFormPageObject: ScheduleFormPageObjectCypress = new ScheduleFormPageObjectCypress(
    ''
  );
  scheduleFormPageObject.setValue(scheduleForm);
  scheduleFormPageObject.submit();
  cy.url({ timeout: 10000 }).should('not.match', /.*scheduler\/new.*/);
  cy.location('pathname').then((loc: any) => {
    const pathname: string = loc as string;
    const id = last(pathname.split('/'));
    scheduleForm.id = id;
    cy.wrap(scheduleForm).as('newScheduleForm');
  });
  return cy.get('@newScheduleForm');
}

export function gotoMyScheduleFormView(scheduleForm: ScheduleForm) {
  siteNavigator.goto(['scheduler', 'my', 'forms']);
  cy.log(`##### Find test schedule form in my schedule-forms #####`);
  const myScheduleFormsPageObject = new ScheduleFormListPageObjectCypress();
  myScheduleFormsPageObject.expectScheduleForm(scheduleForm);
  myScheduleFormsPageObject.viewScheduleForm(scheduleForm);
}

export function deleteScheduleForm(scheduleForm: ScheduleForm) {
  // @ts-ignore
  cy.callFirestore('delete', `schedule-forms/${scheduleForm.id}`);
}

