import { TourPlanAdminPageObject } from '@ygg/playwhat/admin';
import {
  SiteNavigator,
  TourPlanAdminPageObjectCypress
} from '@ygg/playwhat/test';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import { IncomeRecord, Purchase, RelationPurchase } from '@ygg/shopping/core';
import { TheThing } from '@ygg/the-thing/core';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import {
  stubTourPlansByStateAndMonth,
  TourPlanCompleted
} from './sample-tour-plan';

const tourPlansByStateAndMonth: {
  [state: string]: TheThing[];
} = stubTourPlansByStateAndMonth();

const siteNavigator = new SiteNavigator();
const SampleTourPlans = [TourPlanCompleted];
const SampleThings = SamplePlays.concat(SampleEquipments).concat(
  SampleTourPlans
);

const tourPlanAdminPO = new TourPlanAdminPageObjectCypress();
// const tourPlanView = new TourPlanViewPageObjectCypress();
let incomeRecord: IncomeRecord;

describe('Tour-plan administration', () => {
  before(() => {
    login().then(user => {
      theMockDatabase.setAdmins([user.id]);
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });

      const purchases: Purchase[] = TourPlanCompleted.getRelations(
        RelationPurchase.name
      ).map(r => Purchase.fromRelation(r));

      incomeRecord = new IncomeRecord({
        producerId: user.id,
        purchases: purchases
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

    theMockDatabase.clear();
    theMockDatabase.restoreRTDB();
  });

  it('Completed tour-plan should generate income record', () => {
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(TourPlanAdminPageObject.TabNames.incomeRecords);
    tourPlanAdminPO.incomeDataTablePO.expectVisible();
    tourPlanAdminPO.incomeDataTablePO.expectRecord(incomeRecord);
  });
});
