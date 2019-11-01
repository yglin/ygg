import { last } from 'lodash';
import { login } from '../../page-objects/app.po';
import { SiteNavigator } from '../../page-objects/site-navigator';
import {
  SchedulePlanPageObjectCypress,
  SchedulePlanViewPageObjectCypress,
  SchedulePlanListPageObjectCypress,
  deleteSchedulePlan
} from '../../page-objects/scheduler';
import {
  SchedulePlan,
  SchedulePlanViewPagePageObject
} from '@ygg/playwhat/scheduler';
import { SchedulePlanViewPagePageObjectCypress } from '../../page-objects/scheduler/schedule-plan-view-page.po';
import { Tags } from '@ygg/tags/core';
import { deleteTags } from "../../page-objects/tags";

describe('Scheduler - schedule-plan', () => {
  const siteNavigator = new SiteNavigator();
  const schedulePlanPageObject: SchedulePlanPageObjectCypress = new SchedulePlanPageObjectCypress(
    ''
  );
  const schedulePlanViewPageObject: SchedulePlanViewPageObjectCypress = new SchedulePlanViewPageObjectCypress(
    ''
  );
  const schedulePlanViewPagePageObject: SchedulePlanViewPagePageObject = new SchedulePlanViewPagePageObjectCypress(
    ''
  );

  beforeEach(function() {
    cy.visit('/');
    login();
  });

  // it('Should submit consistent data', () => {
  //   siteNavigator.goto(['scheduler', 'new']);
  //   const testSchedulePlan = SchedulePlan.forge();
  //   schedulePlanPageObject.setValue(testSchedulePlan);
  //   schedulePlanPageObject.submit();
  //   cy.url().should('not.match', /.*scheduler\/new.*/);
  //   schedulePlanViewPageObject.expectValue(testSchedulePlan);
  //   cy.location('pathname').then((loc: any) => {
  //     const pathname: string = loc as string;
  //     const id = last(pathname.split('/'));
  //     if (id) {
  //       testSchedulePlan.id = id;
  //       deleteSchedulePlan(testSchedulePlan);
  //     }
  //   });
  // });

  it('should be able to find and edit, update schedule-plan', () => {
    // Goto scheduler/new page, create testSchedulePlan
    siteNavigator.goto(['scheduler', 'new']);
    const testSchedulePlan = SchedulePlan.forge();
    
    // XXX Debug number-range input
    // testSchedulePlan.singleBudget.min = 0;
    // testSchedulePlan.singleBudget.max = 500;
    // testSchedulePlan.totalBudget.min = 3068;
    // testSchedulePlan.totalBudget.max = 54088
    // XXX End

    cy.log('##### Create test schedule form #####');
    schedulePlanPageObject.setValue(testSchedulePlan);
    schedulePlanPageObject.submit();
    cy.url({ timeout: 10000 }).should('not.match', /.*scheduler\/new.*/);
    cy.location('pathname').then((loc: any) => {
      const pathname: string = loc as string;
      const id = last(pathname.split('/'));
      cy.wrap(id).as('newSchedulePlanId');
    });
    cy.get<string>('@newSchedulePlanId').then(newSchedulePlanId => {
      cy.log(`##### Got test schedule form, id = ${newSchedulePlanId} #####`);
      testSchedulePlan.id = newSchedulePlanId;

      // Goto my-schedules page, find the testSchedulePlan and check it out
      siteNavigator.goto(['scheduler', 'my', 'forms']);
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
      schedulePlanPageObject.setValue(changedSchedulePlan);
      schedulePlanPageObject.submit();

      // // Being redirected to view page again,
      // // but this time we assert data with changedchangedSchedulePlan
      cy.location('pathname').should('include', testSchedulePlan.id);
      cy.log(`##### Test schedule form updated, check if data is updated #####`);
      schedulePlanViewPageObject.expectValue(changedSchedulePlan);

      cy.log(`##### All done, clean temporary test data #####`);
      const allTags: Tags = testSchedulePlan.tags.merge(changedSchedulePlan.tags);
      deleteSchedulePlan(testSchedulePlan);
      deleteTags(allTags);
    });
  });
});
