import { random, range, sample, sampleSize, sumBy } from 'lodash';
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
import { Purchase, ProductType } from '@ygg/shopping/core';
import { deleteTags } from '../../page-objects/tags';
import { MockDatabase } from '../../support/mock-database';
import { NumberRange } from '@ygg/shared/types';
import { Play } from '@ygg/playwhat/play';
import { PlaySelectorPageObjectCypress } from '../../page-objects/play';
import { PurchaseListPageObjectCypress } from '../../page-objects/shopping/purchase';

describe('Scheduler - schedule-plan', () => {
  const testPlays: Play[] = range(random(3, 7)).map(() => Play.forge());
  let numParticipants = 53;
  let purchases: Purchase[] = sampleSize(testPlays, 3).map(
    play =>
      new Purchase({
        productType: ProductType.Play,
        productId: play.id,
        quantity: numParticipants
      })
  );
  const testSchedulePlan1 = SchedulePlan.forge({ numParticipants, purchases });
  numParticipants = 67;
  purchases = sampleSize(testPlays, 3).map(
    play =>
      new Purchase({
        productType: ProductType.Play,
        productId: play.id,
        quantity: numParticipants
      })
  );
  const testSchedulePlan2 = SchedulePlan.forge({ numParticipants, purchases });
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
    mockDatabase.insertDocuments(
      testPlays.map(play => {
        return { path: `plays/${play.id}`, data: play.toJSON() };
      })
    );
  });

  after(() => {
    cy.log(`##### All done, clean temporary test data #####`);
    mockDatabase.clear();
  });

  it('should be able to find and edit, update schedule-plan', () => {
    createSchedulePlan(testSchedulePlan1).then(testSchedulePlan => {
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
      cy.log(`##### Edit test schedule form, fill in different data #####`);
      schedulePlanControlPageObject.clearValue(testSchedulePlan);
      schedulePlanControlPageObject.setValue(testSchedulePlan2);
      schedulePlanControlPageObject.submit();

      // // Being redirected to view page again,
      // // but this time we assert data with changedchangedSchedulePlan
      cy.location('pathname')
        .should('include', testSchedulePlan.id)
        .then(() => {
          mockDatabase.pushDocument({
            path: `schedule-plans/${testSchedulePlan.id}`,
            data: testSchedulePlan2
          });
        });
      cy.log(
        `##### Test schedule form updated, check if data is updated #####`
      );
      schedulePlanViewPageObject.expectValue(testSchedulePlan2);
    });
  });

  /*
  it('should auto sync total budget and single budget', () => {
    let testNumParticipants;
    let testTotalBudget: NumberRange;
    let testSingleBudget: NumberRange;
    siteNavigator.goto(['scheduler', 'schedule-plans', 'new']);
    // Set total-budget, should update single-budget
    testNumParticipants = 13;
    testTotalBudget = new NumberRange(1000, 5000);
    testSingleBudget = new NumberRange(
      Math.floor(1000 / testNumParticipants),
      Math.floor(5000 / testNumParticipants)
    );
    schedulePlanControlPageObject.setNumParticipants(testNumParticipants);
    cy.wait(1000);
    schedulePlanControlPageObject.setTotalBudget(testTotalBudget);
    cy.wait(1000);
    schedulePlanControlPageObject.expectSingleBudget(testSingleBudget);
    testNumParticipants = 17;
    testTotalBudget = new NumberRange(2343, 12345);
    testSingleBudget = new NumberRange(
      Math.floor(2343 / testNumParticipants),
      Math.floor(12345 / testNumParticipants)
    );
    schedulePlanControlPageObject.setNumParticipants(testNumParticipants);
    cy.wait(1000);
    schedulePlanControlPageObject.setTotalBudget(testTotalBudget);
    cy.wait(1000);
    schedulePlanControlPageObject.expectSingleBudget(testSingleBudget);
    testNumParticipants = 29;
    testTotalBudget = new NumberRange(17854, 30678);
    testSingleBudget = new NumberRange(
      Math.floor(17854 / testNumParticipants),
      Math.floor(30678 / testNumParticipants)
    );
    schedulePlanControlPageObject.setNumParticipants(testNumParticipants);
    cy.wait(1000);
    schedulePlanControlPageObject.setTotalBudget(testTotalBudget);
    cy.wait(1000);
    schedulePlanControlPageObject.expectSingleBudget(testSingleBudget);

    // Set single-budget, should update total-budget
    testNumParticipants = 7;
    testSingleBudget = new NumberRange(100, 700);
    testTotalBudget = new NumberRange(
      100 * testNumParticipants,
      700 * testNumParticipants
    );
    schedulePlanControlPageObject.setNumParticipants(testNumParticipants);
    cy.wait(1000);
    schedulePlanControlPageObject.setSingleBudget(testSingleBudget);
    cy.wait(1000);
    schedulePlanControlPageObject.expectTotalBudget(testTotalBudget);
    testNumParticipants = 17;
    testSingleBudget = new NumberRange(333, 777);
    testTotalBudget = new NumberRange(
      333 * testNumParticipants,
      777 * testNumParticipants
    );
    schedulePlanControlPageObject.setNumParticipants(testNumParticipants);
    cy.wait(1000);
    schedulePlanControlPageObject.setSingleBudget(testSingleBudget);
    cy.wait(1000);
    schedulePlanControlPageObject.expectTotalBudget(testTotalBudget);
    testNumParticipants = 37;
    testSingleBudget = new NumberRange(3, 12345);
    testTotalBudget = new NumberRange(
      3 * testNumParticipants,
      12345 * testNumParticipants
    );
    schedulePlanControlPageObject.setNumParticipants(testNumParticipants);
    cy.wait(1000);
    schedulePlanControlPageObject.setSingleBudget(testSingleBudget);
    cy.wait(1000);
    schedulePlanControlPageObject.expectTotalBudget(testTotalBudget);

    // change num-participants, should update total-budget from single-budget
    testSingleBudget = new NumberRange(3, 52);
    schedulePlanControlPageObject.setSingleBudget(testSingleBudget);
    cy.wait(1000);
    testNumParticipants = 13;
    schedulePlanControlPageObject.setNumParticipants(testNumParticipants);
    cy.wait(1000);
    testTotalBudget = new NumberRange(
      3 * testNumParticipants,
      52 * testNumParticipants
    );
    schedulePlanControlPageObject.expectTotalBudget(testTotalBudget);

    testNumParticipants = 31;
    schedulePlanControlPageObject.setNumParticipants(testNumParticipants);
    cy.wait(1000);
    testTotalBudget = new NumberRange(
      3 * testNumParticipants,
      52 * testNumParticipants
    );
    schedulePlanControlPageObject.expectTotalBudget(testTotalBudget);

    testNumParticipants = 47;
    schedulePlanControlPageObject.setNumParticipants(testNumParticipants);
    cy.wait(1000);
    testTotalBudget = new NumberRange(
      3 * testNumParticipants,
      52 * testNumParticipants
    );
    schedulePlanControlPageObject.expectTotalBudget(testTotalBudget);
  });

  it('should list all plays', () => {
    siteNavigator.goto(['scheduler', 'schedule-plans', 'new']);
    const playSelectorPageObject = new PlaySelectorPageObjectCypress('');
    playSelectorPageObject.expectPlays(testPlays);
  });

  it('Click on plays should add purchases of them ,and sum up total price', () => {
    const numParticipants = 13;
    const selectedPlays = sampleSize(testPlays, 3);
    const expectedTotalPrice = sumBy(selectedPlays, play => new Purchase(play, numParticipants).getPrice());
    siteNavigator.goto(['scheduler', 'schedule-plans', 'new']);
    schedulePlanControlPageObject.setNumParticipants(numParticipants);
    const playSelectorPageObject = new PlaySelectorPageObjectCypress('');
    playSelectorPageObject.clickPlays(selectedPlays);
    const purchaseListPageObject = new PurchaseListPageObjectCypress('');
    purchaseListPageObject.expectProducts(selectedPlays);
    purchaseListPageObject.expectTotalPrice(expectedTotalPrice);
  });

  it('Change numParticipants should refresh purchases and total price', () => {
    let numParticipants = 13;
    const selectedPlays = sampleSize(testPlays, 3);
    let expectedTotalPrice = sumBy(selectedPlays, play =>
      new Purchase(play, numParticipants).getPrice()
    );
    siteNavigator.goto(['scheduler', 'schedule-plans', 'new']);
    schedulePlanControlPageObject.setNumParticipants(numParticipants);
    const playSelectorPageObject = new PlaySelectorPageObjectCypress('');
    playSelectorPageObject.clickPlays(selectedPlays);
    const purchaseListPageObject = new PurchaseListPageObjectCypress('');
    purchaseListPageObject.expectProducts(selectedPlays);
    purchaseListPageObject.expectTotalPrice(expectedTotalPrice);

    // Change numParticipants
    numParticipants = 29;
    expectedTotalPrice = sumBy(selectedPlays, play =>
      new Purchase(play, numParticipants).getPrice()
    );
    schedulePlanControlPageObject.setNumParticipants(numParticipants);
    purchaseListPageObject.expectProducts(selectedPlays);
    purchaseListPageObject.expectTotalPrice(expectedTotalPrice);
  });
*/
});
