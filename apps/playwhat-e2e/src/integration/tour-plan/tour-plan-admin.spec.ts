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
import { loginTestUser, testUsers, waitForLogin } from '@ygg/shared/user/test';
import { User } from '@ygg/shared/user/core';
import { beforeAll } from '../../support/before-all';

describe('Tour-plan administration', () => {
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
  const me: User = testUsers[0];

  before(() => {
    beforeAll();
    theMockDatabase.setAdmins([me.id]);
    cy.wrap(SampleThings).each((thing: any) => {
      thing.ownerId = me.id;
      theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
    });
    incomeRecord = new IncomeRecord({
      producerId: me.id,
      purchases: purchases
    });

    cy.visit('/');
    loginTestUser(me);
  });

  beforeEach(() => {
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
  });

  after(() => {
    theMockDatabase.clear();
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
