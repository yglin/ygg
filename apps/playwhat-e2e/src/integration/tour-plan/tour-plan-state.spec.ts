import { ImitationTourPlan } from '@ygg/playwhat/core';
import {
  SiteNavigator,
  TourPlanAdminPageObjectCypress,
  TourPlanViewPageObjectCypress
} from '@ygg/playwhat/test';
import { Month } from '@ygg/shared/omni-types/core';
import {
  login,
  theMockDatabase,
  getCurrentUser
} from '@ygg/shared/test/cypress';
import { ImitationOrder } from '@ygg/shopping/core';
import { TheThing } from '@ygg/the-thing/core';
import {
  MyThingsDataTablePageObjectCypress,
  TheThingStatePageObjectCypress,
  MyThingsPageObjectCypress
} from '@ygg/the-thing/test';
import { flatten, keys, values } from 'lodash';
import { SampleAdditions, SamplePlays } from '../play/sample-plays';
import {
  stubTourPlansByStateAndMonth,
  TourPlanInApplication,
  TourPlanPaid,
  MinimalTourPlan
} from './sample-tour-plan';

const tourPlansByStateAndMonth: {
  [state: string]: TheThing[];
} = stubTourPlansByStateAndMonth();

const siteNavigator = new SiteNavigator();
const SampleTourPlans = [TourPlanInApplication, TourPlanPaid].concat(
  flatten(values(tourPlansByStateAndMonth))
);
const SampleThings = SamplePlays.concat(SampleAdditions).concat(
  SampleTourPlans
);

const tourPlanAdminPO = new TourPlanAdminPageObjectCypress();
const tourPlanViewPO = new TourPlanViewPageObjectCypress();
const myTourPlansPO = new MyThingsDataTablePageObjectCypress();
// let incomeRecord: IncomeRecord;

describe('Tour-plan state manipulation', () => {
  before(() => {
    login().then(user => {
      theMockDatabase.setAdmins([user.id]);
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });
      cy.visit('/');
    });
  });

  beforeEach(() => {});

  after(() => {
    // Goto my-things page and delete previously created things
    const myThingsPO = new MyThingsPageObjectCypress();
    siteNavigator.goto(['the-things', 'my'], myThingsPO);
    cy.wait(3000);
    myThingsPO.deleteAll();
    theMockDatabase.clear();
    theMockDatabase.restoreRTDB();
  });

  it('Save a tour-plan and set it for application as well', () => {
    const MinimalTourPlan2 = MinimalTourPlan.clone();
    MinimalTourPlan2.name = '測試遊程(儲存順便送出申請)';

    siteNavigator.goto([ImitationTourPlan.routePath, 'create']);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.setValue(MinimalTourPlan2);
    tourPlanViewPO.save(MinimalTourPlan2, {
      freshNew: true,
      sendApplication: true
    });
    tourPlanViewPO.expectShowAsPage();

    // Expect the submitted tour-plan show up in administrator's list
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    // tourPlanDataTablePO.expectTheThing(MinimalTourPlan);
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.applied.name
    ].expectTheThing(MinimalTourPlan2);
  });

  it('Cancel applied tour-plan', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(TourPlanInApplication);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanInApplication);
    tourPlanViewPO.expectState(ImitationTourPlan.states.applied);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.setState(
      TourPlanInApplication,
      ImitationTourPlan.states.new
    );
    tourPlanViewPO.expectState(ImitationTourPlan.states.new);
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(ImitationOrder.states.applied.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.applied.name
    ].expectNotTheThing(TourPlanInApplication);
    // Reset TourPlanInApplication state
    theMockDatabase.insert(
      `${TheThing.collection}/${TourPlanInApplication.id}`,
      TourPlanInApplication
    );
  });

  it('Approve tour-plan as paid by set it state Paid', () => {
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(ImitationOrder.states.applied.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.applied.name
    ].gotoTheThingView(TourPlanInApplication);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectState(ImitationOrder.states.applied);
    tourPlanViewPO.setState(
      TourPlanInApplication,
      ImitationTourPlan.states.paid
    );
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(ImitationOrder.states.applied.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.applied.name
    ].expectNotTheThing(TourPlanInApplication);
    tourPlanAdminPO.switchToTab(ImitationOrder.states.paid.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.paid.name
    ].expectVisible();
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.paid.name
    ].expectTheThing(TourPlanInApplication);
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.paid.name
    ].gotoTheThingView(TourPlanInApplication);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectState(ImitationOrder.states.paid);
  });

  it('Complete tour-plan to set it state Completed', () => {
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(ImitationOrder.states.paid.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.paid.name
    ].gotoTheThingView(TourPlanPaid);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectState(ImitationOrder.states.paid);
    tourPlanViewPO.setState(TourPlanPaid, ImitationTourPlan.states.completed);
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(ImitationOrder.states.paid.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.paid.name
    ].expectNotTheThing(TourPlanPaid);
    tourPlanAdminPO.switchToTab(ImitationOrder.states.completed.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.completed.name
    ].expectVisible();
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.completed.name
    ].expectTheThing(TourPlanPaid);
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.completed.name
    ].gotoTheThingView(TourPlanPaid);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectState(ImitationOrder.states.completed);
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
});

describe('States button accessibility', () => {
  before(() => {
    login().then(user => {
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });
      cy.visit('/');
    });
  });

  beforeEach(() => {});

  after(() => {
    theMockDatabase.clear();
    theMockDatabase.restoreRTDB();
  });

  it('Can not set states paid if not admin', () => {
    theMockDatabase.setAdmins([]);
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(TourPlanInApplication);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanInApplication);
    tourPlanViewPO.expectState(ImitationTourPlan.states.applied);
    tourPlanViewPO.statePO.expectNoStateButton(ImitationTourPlan.states.paid);
    getCurrentUser().then(user => theMockDatabase.setAdmins([user.id]));
    tourPlanViewPO.statePO.expectStateButton(ImitationTourPlan.states.paid);
    theMockDatabase.restoreRTDB();
  });

  it('Can not set states completed if not admin', () => {
    theMockDatabase.setAdmins([]);
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(TourPlanPaid);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanPaid);
    tourPlanViewPO.expectState(ImitationTourPlan.states.paid);
    tourPlanViewPO.statePO.expectNoStateButton(
      ImitationTourPlan.states.completed
    );
    getCurrentUser().then(user => theMockDatabase.setAdmins([user.id]));
    tourPlanViewPO.statePO.expectStateButton(ImitationTourPlan.states.completed);
    theMockDatabase.restoreRTDB();
  });

  it('Can not apply tour plan if not owner', () => {
    const tourPlanNotMine = MinimalTourPlan.clone();
    tourPlanNotMine.name = '測試遊程(不是我的)';
    ImitationTourPlan.setState(tourPlanNotMine, ImitationTourPlan.states.new);
    theMockDatabase.insert(
      `${TheThing.collection}/${tourPlanNotMine.id}`,
      tourPlanNotMine
    );
    cy.visit(`${ImitationTourPlan.routePath}/${tourPlanNotMine.id}`);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectState(ImitationTourPlan.states.new);
    tourPlanViewPO.statePO.expectNoStateButton(ImitationTourPlan.states.applied);
  });

  it('Can not cancel tour plan apply if not owner', () => {
    const tourPlanNotMine = MinimalTourPlan.clone();
    tourPlanNotMine.name = '測試遊程(不是我的，已申請)';
    ImitationTourPlan.setState(
      tourPlanNotMine,
      ImitationTourPlan.states.applied
    );
    theMockDatabase.insert(
      `${TheThing.collection}/${tourPlanNotMine.id}`,
      tourPlanNotMine
    );
    cy.visit(`${ImitationTourPlan.routePath}/${tourPlanNotMine.id}`);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectState(ImitationTourPlan.states.applied);
    tourPlanViewPO.statePO.expectNoStateButton(ImitationTourPlan.states.new);
  });
});
