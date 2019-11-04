import { last } from "lodash";
import { SchedulePlan } from '@ygg/playwhat/scheduler';
import { SiteNavigator } from '../site-navigator';
import { SchedulePlanPageObjectCypress } from "./schedule-plan.po";
import { SchedulePlanListPageObjectCypress } from './schedule-plan-list.po';

export * from './schedule-plan.po';
export * from './schedule-plan-view.po';
export * from './schedule-plan-list.po';

const siteNavigator = new SiteNavigator();

export function createSchedulePlan(schedulePlan: SchedulePlan): Cypress.Chainable<any> {
  siteNavigator.goto(['scheduler', 'new']);

  // XXX Debug number-range input
  // testSchedulePlan.singleBudget.min = 0;
  // testSchedulePlan.singleBudget.max = 500;
  // testSchedulePlan.totalBudget.min = 3068;
  // testSchedulePlan.totalBudget.max = 54088
  // XXX End

  cy.log('##### Create test schedule form #####');
  const schedulePlanPageObject: SchedulePlanPageObjectCypress = new SchedulePlanPageObjectCypress(
    ''
  );
  schedulePlanPageObject.setValue(schedulePlan);
  schedulePlanPageObject.submit();
  cy.url({ timeout: 10000 }).should('not.match', /.*scheduler\/new.*/);
  cy.location('pathname').then((loc: any) => {
    const pathname: string = loc as string;
    const id = last(pathname.split('/'));
    schedulePlan.id = id;
    cy.wrap(schedulePlan).as('newSchedulePlan');
  });
  return cy.get('@newSchedulePlan');
}

export function gotoMySchedulePlanView(schedulePlan: SchedulePlan) {
  siteNavigator.goto(['scheduler', 'my', 'plans']);
  cy.log(`##### Find test schedule form in my schedule-plans #####`);
  const mySchedulePlansPageObject = new SchedulePlanListPageObjectCypress();
  mySchedulePlansPageObject.expectSchedulePlan(schedulePlan);
  mySchedulePlansPageObject.viewSchedulePlan(schedulePlan);
}

export function deleteSchedulePlan(schedulePlan: SchedulePlan) {
  // @ts-ignore
  cy.callFirestore('delete', `schedule-plans/${schedulePlan.id}`);
}

