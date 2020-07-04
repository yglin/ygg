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
import { keys, values, flatten } from 'lodash';
import { Month } from '@ygg/shared/omni-types/core';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import { waitForLogin } from '@ygg/shared/user/test';

const tourPlansByStateAndMonth: {
  [state: string]: TheThing[];
} = stubTourPlansByStateAndMonth();
const TourPlanCompletedThisMonth =
  tourPlansByStateAndMonth[ImitationTourPlan.states.completed.name][0];
const purchases: Purchase[] = TourPlanCompletedThisMonth.getRelations(
  RelationPurchase.name
).map(r => Purchase.fromRelation(r));

const siteNavigator = new SiteNavigator();
// const SampleTourPlans = [TourPlanCompleted];
const SampleThings = SamplePlays.concat(SampleEquipments)
  // .concat(SampleTourPlans)
  .concat(flatten(values(tourPlansByStateAndMonth)));

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
      incomeRecord = new IncomeRecord({
        producerId: user.id,
        purchases: purchases
      });

      cy.visit('/');
      waitForLogin();
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
    // theMockDatabase.restoreRTDB();
  });

  it('Filter tour-plans by month', () => {
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    cy.wrap(keys(tourPlansByStateAndMonth)).each((stateName: any) => {
      tourPlanAdminPO.switchToTab(stateName);
      const tourPlans = tourPlansByStateAndMonth[stateName];
      cy.wrap(tourPlans).each((tourPlan: any, index: number) => {
        const offset = -index;
        tourPlanAdminPO.selectMonth(Month.fromMonthOffset(offset));
        const theThingDataTablePO =
          tourPlanAdminPO.theThingDataTables[stateName];
        theThingDataTablePO.expectTheThing(tourPlan);
      });
    });
  });

  it('Completed tour-plan should generate income record', () => {
    // Remove
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(TourPlanAdminPageObject.TabNames.incomeRecords);
    tourPlanAdminPO.incomeDataTablePO.expectVisible();
    tourPlanAdminPO.incomeDataTablePO.expectRecord(incomeRecord);
  });
});
