import { login, insertDB } from '../../page-objects/app.po';
import {
  deleteSchedulePlan,
  gotoMySchedulePlanView
} from '../../page-objects/scheduler';
import { SchedulePlan } from '@ygg/schedule/core';
import { SchedulePlanViewPagePageObject } from '@ygg/schedule/frontend';
import { deleteTags } from '../../page-objects/tags';
import { SchedulePlanViewPagePageObjectCypress } from '../../page-objects/scheduler/schedule-plan-view-page.po';
import { MockDatabase } from "../../support/mock-database";

describe('Create a new schedule from schedule-plan', () => {
  // const testSchedulePlans: SchedulePlan[] = [];
  const mockDatabase = new MockDatabase();

  before(function() {
    cy.visit('/');
    login().then(user => {
      const testSchedulePlan = SchedulePlan.forge();
      testSchedulePlan.creatorId = user.id;
      mockDatabase.insert(`schedule-plans/${testSchedulePlan.id}`, testSchedulePlan).then(() => {
        // testSchedulePlans.push(testSchedulePlan);
        cy.wrap(testSchedulePlan).as('testSchedulePlan');
      });
    });
  });

  after(function() {
    mockDatabase.clear();
    // cy.wrap(testSchedulePlans).each((schedulePlan: any, index: number) => {
    //   deleteSchedulePlan(schedulePlan);
    //   deleteTags(schedulePlan.tags);
    // });
  });

  beforeEach(function() {});

  it("should start from an exist schedule-plan's view page", () => {
    cy.get<SchedulePlan>('@testSchedulePlan').then(testSchedulePlan => {
      cy.log('======= Go to the view page of test schedule plan');
      gotoMySchedulePlanView(testSchedulePlan);
      cy.log('======= Click the create-schedule button');
      const schedulePlanViewPagePageObject: SchedulePlanViewPagePageObject = new SchedulePlanViewPagePageObjectCypress(
        ''
      );
      schedulePlanViewPagePageObject.createSchedule();
      cy.log("======= Should land on new schedule's edit page now");
      cy.url().should('match', /scheduler\/schedules\/.*\/edit/);
    });
  });
});

