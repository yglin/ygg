import { sampleSize } from 'lodash';
import { MockDatabase, login, getCurrentUser } from '@ygg/shared/test/cypress';
import { TourPlanInApplication } from './sample-tour-plan';
import { SamplePlays, SampleAdditions } from '../play/sample-plays';
import { MyThingsPageObjectCypress } from '@ygg/the-thing/test';
import {
  TourPlanViewPageObjectCypress,
  TourPlanBuilderPageObjectCypress,
  TourPlanAdminPageObjectCypress
} from '@ygg/playwhat/test';
import { SiteNavigator } from '@ygg/playwhat/test';
import { TheThing } from '@ygg/the-thing/core';
import {
  Purchase,
  RelationNamePurchase,
  IncomeRecord
} from '@ygg/shopping/core';
import { TourPlanAdminPageObject } from '@ygg/playwhat/admin';

let mockDatabase: MockDatabase;
const siteNavigator = new SiteNavigator();
const SampleTourPlans = [TourPlanInApplication];
const SampleThings = SamplePlays.concat(SampleAdditions).concat(
  SampleTourPlans
);

const tourPlanAdminPO = new TourPlanAdminPageObjectCypress();
const tourPlanView = new TourPlanViewPageObjectCypress();

describe('Tour-plan administration', () => {
  before(() => {
    mockDatabase = new MockDatabase();
    login().then(user => {
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        mockDatabase.insert(
          `${TheThing.collection}/${thing.id}`,
          thing.toJSON()
        );
      });
      cy.visit('/');
    });
  });

  beforeEach(() => {
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
  });

  after(() => {
    // // Goto my-things page and delete all test things
    // const myThingsPO = new MyThingsPageObjectCypress();
    // siteNavigator.goto(['the-things', 'my'], myThingsPO);
    // cy.wait(3000);
    // myThingsPO.deleteAll();

    mockDatabase.clear();
    mockDatabase.restoreRTDB();
  });

  it('Completed tour-plan should generate income record', () => {
    const purchases: Purchase[] = TourPlanInApplication.getRelations(
      RelationNamePurchase
    ).map(r => Purchase.fromRelation(r));
    getCurrentUser().then(user => {
      const ir = new IncomeRecord({
        producerId: user.id,
        purchases: purchases
      });

      tourPlanAdminPO.gotoView(TourPlanInApplication);
      tourPlanView.expectVisible();
      tourPlanView.adminComplete();
      siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
      tourPlanAdminPO.switchToTab(TourPlanAdminPageObject.TabNames.incomeRecords);
      tourPlanAdminPO.incomeDataTablePO.expectVisible();
      tourPlanAdminPO.incomeDataTablePO.expectRecord(ir);
    });
  });
});
