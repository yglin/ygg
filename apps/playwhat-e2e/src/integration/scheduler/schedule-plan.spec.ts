import { last } from 'lodash';
import { login } from '../../page-objects/app.po';
import { SiteNavigator } from '../../page-objects/site-navigator';
import {
  SchedulePlanControlPageObjectCypress,
  SchedulePlanViewPageObjectCypress,
  SchedulePlanListPageObjectCypress,
  deleteSchedulePlan
} from '../../page-objects/scheduler';
import { SchedulePlan } from '@ygg/schedule/core';
import { SchedulePlanViewPagePageObject } from '@ygg/schedule/frontend';
import {
  SchedulePlanViewPagePageObjectCypress,
  createSchedulePlan
} from '../../page-objects/scheduler';
import { Tags } from '@ygg/tags/core';
import { deleteTags } from '../../page-objects/tags';
import { MockDatabase } from '../../support/mock-database';

describe('Scheduler - schedule-plan', () => {
  const siteNavigator = new SiteNavigator();
  const schedulePlanControlPageObject = new SchedulePlanControlPageObjectCypress(
    ''
  );
  const schedulePlanViewPageObject: SchedulePlanViewPageObjectCypress = new SchedulePlanViewPageObjectCypress(
    ''
  );
  const schedulePlanViewPagePageObject: SchedulePlanViewPagePageObject = new SchedulePlanViewPagePageObjectCypress(
    ''
  );
  const mockDatabase: MockDatabase = new MockDatabase();

  before(function() {
    cy.visit('/');
    login();
  });

  after(() => {
    cy.log(`##### All done, clean temporary test data #####`);
    mockDatabase.clear();
  });

  it('should be able to find and edit, update schedule-plan', () => {
    createSchedulePlan(SchedulePlan.forge()).then(testSchedulePlan => {
      mockDatabase.pushDocument({
        path: `schedule-plans/${testSchedulePlan.id}`,
        data: testSchedulePlan
      });
      // Goto my-schedules page, find the testSchedulePlan and check it out
      siteNavigator.goto(['scheduler', 'schedule-plans', 'my']);
      cy.log(`##### Find test schedule form in my schedule-plans #####`);
      const mySchedulePlansPageObject = new SchedulePlanListPageObjectCypress();
      mySchedulePlansPageObject.expectSchedulePlan(testSchedulePlan);
      mySchedulePlansPageObject.viewSchedulePlan(testSchedulePlan);

      // In view page of testSchedulePlan, click edit button and goto edit page
      cy.location('pathname').should('include', testSchedulePlan.id);
      cy.log(`##### Found test schedule form, go to its edit page #####`);
      schedulePlanViewPagePageObject.gotoEdit();

      // In edit page of testSchedulePlan, change data and submit
      // The edit page is exactly the same as scheduler/new page,
      // so we can reuse the same page object
      cy.location('pathname').should('include', `${testSchedulePlan.id}/edit`);
      const changedSchedulePlan = SchedulePlan.forge();
      cy.log(`##### Edit test schedule form, fill in different data #####`);
      schedulePlanControlPageObject.clearValue(testSchedulePlan);
      schedulePlanControlPageObject.setValue(changedSchedulePlan);
      schedulePlanControlPageObject.submit();

      // // Being redirected to view page again,
      // // but this time we assert data with changedchangedSchedulePlan
      cy.location('pathname')
        .should('include', testSchedulePlan.id)
        .then(() => {
          mockDatabase.pushDocument({
            path: `schedule-plans/${testSchedulePlan.id}`,
            data: changedSchedulePlan
          });
        });
      cy.log(
        `##### Test schedule form updated, check if data is updated #####`
      );
      schedulePlanViewPageObject.expectValue(changedSchedulePlan);
    });
  });

  // it('should auto sync total budget and single budget', () => {});
});
