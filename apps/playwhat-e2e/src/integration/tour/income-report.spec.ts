import { sampleSize, flatten, values, keys } from 'lodash';
import { MockDatabase, login, getCurrentUser } from '@ygg/shared/test/cypress';
import {
  TourPlanInApplication,
  TourPlanPaid,
  TourPlanCompleted,
  stubTourPlansByStateAndMonth
} from './sample-tour-plan';
import { SamplePlays, SampleAdditions } from '../play/sample-plays';
import {
  MyThingsPageObjectCypress,
  TheThingDataTablePageObjectCypress
} from '@ygg/the-thing/test';
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
  IncomeRecord,
  ImitationOrder
} from '@ygg/shopping/core';
import { TourPlanAdminPageObject } from '@ygg/playwhat/admin';
import { Month } from '@ygg/shared/omni-types/core';

const tourPlansByStateAndMonth: {
  [state: string]: TheThing[];
} = stubTourPlansByStateAndMonth();

let mockDatabase: MockDatabase;
const siteNavigator = new SiteNavigator();
const SampleTourPlans = [TourPlanCompleted];
const SampleThings = SamplePlays.concat(SampleAdditions).concat(
  SampleTourPlans
);

const tourPlanAdminPO = new TourPlanAdminPageObjectCypress();
// const tourPlanView = new TourPlanViewPageObjectCypress();
let incomeRecord: IncomeRecord;

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

      const purchases: Purchase[] = TourPlanCompleted.getRelations(
        RelationNamePurchase
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

    mockDatabase.clear();
    mockDatabase.restoreRTDB();
  });

  it('Completed tour-plan should generate income record', () => {
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(TourPlanAdminPageObject.TabNames.incomeRecords);
    tourPlanAdminPO.incomeDataTablePO.expectVisible();
    tourPlanAdminPO.incomeDataTablePO.expectRecord(incomeRecord);
  });

});
