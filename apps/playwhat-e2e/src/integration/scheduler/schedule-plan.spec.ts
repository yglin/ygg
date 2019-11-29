import { random, range, isEmpty, sample, sampleSize, sum, last } from 'lodash';
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
import {
  Purchase,
  ProductType,
  Product,
  PurchaseState
} from '@ygg/shopping/core';
import { deleteTags } from '../../page-objects/tags';
import { MockDatabase, Document } from '../../support/mock-database';
import { NumberRange } from '@ygg/shared/types';
import { Play } from '@ygg/playwhat/play';
import { PlaySelectorPageObjectCypress } from '../../page-objects/play';
import {
  PurchaseListPageObjectCypress,
  PurchaseControlPageObjectCypress
} from '../../page-objects/shopping/purchase';
import { Equipment } from '@ygg/resource/core';
import { ShoppingCartPageObjectCypress } from '../../page-objects/shopping';
import { PlayFormPageObject } from '../../page-objects/play.po';

describe('Scheduler - schedule-plan', () => {
  let testPlays: Play[];
  let playsNoEquipments: Play[];
  let playsWithEquipments: Play[];
  let testSchedulePlan1;
  let testSchedulePlan2;

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

  function prepareTestData() {
    const documents: Document[] = [];
    testPlays = [];
    playsNoEquipments = range(random(2, 5)).map(() =>
      Play.forge({
        numEquipments: 0
      })
    );
    testPlays.push(...playsNoEquipments);
    playsWithEquipments = range(random(1, 3)).map(() =>
      Play.forge({
        numEquipments: random(1, 4)
      })
    );
    testPlays.push(...playsWithEquipments);

    let numParticipants = 53;
    let purchases: Purchase[] = sampleSize(playsNoEquipments, 3).map(
      play =>
        new Purchase({
          product: play,
          quantity: numParticipants
        })
    );
    testSchedulePlan1 = SchedulePlan.forge({ numParticipants, purchases });
    numParticipants = 67;
    purchases = sampleSize(playsNoEquipments, 3).map(
      play =>
        new Purchase({
          product: play,
          quantity: numParticipants
        })
    );
    testSchedulePlan2 = SchedulePlan.forge({ numParticipants, purchases });
    testPlays.forEach(play => {
      documents.push({ path: `plays/${play.id}`, data: play.toJSON() });
      play.equipments.forEach(eq => {
        documents.push({
          path: `${Equipment.collection}/${eq.id}`,
          data: eq.toJSON()
        });
      });
    });

    mockDatabase.insertDocuments(documents);
  }

  before(function() {
    cy.visit('/');
    login();
    prepareTestData();
  });

  after(() => {
    cy.log(`##### All done, clean temporary test data #####`);
    mockDatabase.clear();
  });

  it('Should keep input data on leaving page', () => {
    siteNavigator.goto(['scheduler', 'schedule-plans', 'new']);
    schedulePlanControlPageObject.setValue(testSchedulePlan1);
    cy.visit('/');
    siteNavigator.goto(['scheduler', 'schedule-plans', 'new']);
    schedulePlanControlPageObject.submit();
    cy.url({ timeout: 10000 }).should('not.match', /scheduler\/schedule-plans\/new.*/);
    cy.location('pathname').then((loc: any) => {
      const pathname: string = loc as string;
      const id = last(pathname.split('/'));
      testSchedulePlan1.id = id;
      mockDatabase.pushDocument({
        path: `schedule-plans/${id}`,
        data: testSchedulePlan1.toJSON()
      });
      schedulePlanViewPageObject.expectValue(testSchedulePlan1);
    });
  });

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

  it('Click on play with no equipment should add purchase of it directly', () => {
    const numParticipants = 13;
    const play = sample(playsNoEquipments);
    const purchase = new Purchase({ product: play, quantity: numParticipants });
    siteNavigator.goto(['scheduler', 'schedule-plans', 'new']);
    schedulePlanControlPageObject.setNumParticipants(numParticipants);
    const shoppingCartPageObject = new ShoppingCartPageObjectCypress('');
    const playSelectorPageObject = new PlaySelectorPageObjectCypress('');
    shoppingCartPageObject.clear();
    playSelectorPageObject.clickPlay(play);
    shoppingCartPageObject.expectPurchase(purchase);
  });

  it('Click on play with equipments should pop purchase edit dialog', () => {
    const numParticipants = 23;
    const play = sample(playsWithEquipments);
    const purchase = new Purchase({ product: play, quantity: numParticipants });
    siteNavigator.goto(['scheduler', 'schedule-plans', 'new']);
    schedulePlanControlPageObject.setNumParticipants(numParticipants);
    const shoppingCartPageObject = new ShoppingCartPageObjectCypress('');
    const playSelectorPageObject = new PlaySelectorPageObjectCypress('');
    shoppingCartPageObject.clear();
    playSelectorPageObject.clickPlay(play);
    const purchaseControlPageObject = new PurchaseControlPageObjectCypress(
      '.ygg-dialog'
    );
    purchaseControlPageObject.setValue(purchase);
    purchaseControlPageObject.submit();
    shoppingCartPageObject.expectPurchase(purchase);
  });

  it('Should be able to add play on the fly', () => {
    const playSelectorPageObject = new PlaySelectorPageObjectCypress('');
    siteNavigator.goto(['scheduler', 'schedule-plans', 'new']);
    const testPlay = Play.forge();
    playSelectorPageObject.gotoCreatePlay();
    const playFormPageObject = new PlayFormPageObject();
    playFormPageObject.fillIn(testPlay);
    playFormPageObject.submit();
    cy.url({timeout: 10000}).should('not.match', /\/plays\/new/);
    cy.location('pathname').then((pathnames: any) => {
      const id = last((pathnames as string).split('/'));
      testPlay.id = id;
      mockDatabase.pushDocument({
        path: `plays/${id}`,
        data: testPlay.toJSON()
      });
      siteNavigator.goto(['scheduler', 'schedule-plans', 'new']);
      // The new play should show up
      playSelectorPageObject.expectPlay(testPlay);
    });
  });

  // Too thoughtful for user, rather not do it for now
  // it('Change numParticipants should refresh purchases and total price', () => {
  //   let numParticipants = 13;
  //   const selectedPlays = sampleSize(testPlays, 3);
  //   let expectedTotalPrice = sumBy(selectedPlays, play =>
  //     new Purchase(play, numParticipants).getPrice()
  //   );
  //   siteNavigator.goto(['scheduler', 'schedule-plans', 'new']);
  //   schedulePlanControlPageObject.setNumParticipants(numParticipants);
  //   const playSelectorPageObject = new PlaySelectorPageObjectCypress('');
  //   playSelectorPageObject.clickPlays(selectedPlays);
  //   const purchaseListPageObject = new PurchaseListPageObjectCypress('');
  //   purchaseListPageObject.expectProducts(selectedPlays);
  //   purchaseListPageObject.expectTotalPrice(expectedTotalPrice);

  //   // Change numParticipants
  //   numParticipants = 29;
  //   expectedTotalPrice = sumBy(selectedPlays, play =>
  //     new Purchase(play, numParticipants).getPrice()
  //   );
  //   schedulePlanControlPageObject.setNumParticipants(numParticipants);
  //   purchaseListPageObject.expectProducts(selectedPlays);
  //   purchaseListPageObject.expectTotalPrice(expectedTotalPrice);
  // });

  it('should be able to create and update schedule-plan', () => {
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
        .should('not.include', 'edit')
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
});
