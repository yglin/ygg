import { last } from "lodash";
import { SchedulePlan } from '@ygg/schedule/core';
import { SiteNavigator } from '../site-navigator';
import { SchedulePlanControlPageObjectCypress } from "./schedule-plan-control.po";
import { SchedulePlanListPageObjectCypress } from './schedule-plan-list.po';

export * from './schedule-plan-control.po';
export * from './schedule-plan-view.po';
export * from './schedule-plan-view-page.po';
export * from './schedule-plan-list.po';

const siteNavigator = new SiteNavigator();

export function createSchedulePlan(schedulePlan: SchedulePlan): Cypress.Chainable<any> {
  siteNavigator.goto(['scheduler', 'schedule-plans', 'new']);

  cy.log('##### Create test schedule form #####');
  const schedulePlanPageObject = new SchedulePlanControlPageObjectCypress(
    ''
  );
  schedulePlanPageObject.setValue(schedulePlan);
  schedulePlanPageObject.submit();
  cy.url({ timeout: 10000 }).should('not.match', /scheduler\/schedule-plans\/new.*/);
  cy.location('pathname').then((loc: any) => {
    const pathname: string = loc as string;
    const id = last(pathname.split('/'));
    schedulePlan.id = id;
    cy.wrap(schedulePlan).as('newSchedulePlan');
  });
  return cy.get('@newSchedulePlan');
}

export function gotoMySchedulePlanView(schedulePlan: SchedulePlan) {
  siteNavigator.goto(['scheduler', 'schedule-plans', 'my']);
  cy.log(`##### Find test schedule form in my schedule-plans #####`);
  const mySchedulePlansPageObject = new SchedulePlanListPageObjectCypress();
  mySchedulePlansPageObject.expectSchedulePlan(schedulePlan);
  mySchedulePlansPageObject.viewSchedulePlan(schedulePlan);
}

export function deleteSchedulePlan(schedulePlan: SchedulePlan) {
  // @ts-ignore
  cy.callFirestore('delete', `schedule-plans/${schedulePlan.id}`);
}

