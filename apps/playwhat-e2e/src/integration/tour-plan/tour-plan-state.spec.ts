import { ImitationTourPlan } from '@ygg/playwhat/core';
import {
  SiteNavigator,
  TourPlanAdminPageObjectCypress,
  TourPlanViewPageObjectCypress
} from '@ygg/playwhat/test';
import { Month } from '@ygg/shared/omni-types/core';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import { ImitationOrder } from '@ygg/shopping/core';
import { TheThing } from '@ygg/the-thing/core';
import { MyThingsDataTablePageObjectCypress } from '@ygg/the-thing/test';
import { flatten, keys, values } from 'lodash';
import { SampleAdditions, SamplePlays } from '../play/sample-plays';
import {
  stubTourPlansByStateAndMonth,
  TourPlanInApplication,
  TourPlanPaid
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
const tourPlanView = new TourPlanViewPageObjectCypress();
const myTourPlansPO = new MyThingsDataTablePageObjectCypress();
// let incomeRecord: IncomeRecord;

describe('Tour-plan administration', () => {
  before(() => {
    login().then(user => {
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });

      // const purchases: Purchase[] = TourPlanCompleted.getRelations(
      //   RelationPurchase.name
      // ).map(r => Purchase.fromRelation(r));

      // incomeRecord = new IncomeRecord({
      //   producerId: user.id,
      //   purchases: purchases
      // });

      cy.visit('/');
    });
  });

  beforeEach(() => {
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
  });

  after(() => {
    theMockDatabase.clear();
    theMockDatabase.restoreRTDB();
  });

  it('Cancel applied tour-plan', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    // cy.pause();
    myTourPlansPO.theThingDataTablePO.expectTheThing(TourPlanInApplication);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanInApplication);
    tourPlanView.expectState(ImitationTourPlan.states.applied.label);
    tourPlanView.expectVisible();
    tourPlanView.setState(TourPlanInApplication, ImitationTourPlan.states.new);
    tourPlanView.expectState(ImitationTourPlan.states.new.label);
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
    tourPlanAdminPO.switchToTab(ImitationOrder.states.applied.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.applied.name
    ].gotoTheThingView(TourPlanInApplication);
    tourPlanView.expectVisible();
    tourPlanView.expectState(ImitationOrder.states.applied.label);
    tourPlanView.setState(TourPlanInApplication, ImitationTourPlan.states.paid);
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
    tourPlanView.expectVisible();
    tourPlanView.expectState(ImitationOrder.states.paid.label);
  });

  it('Complete tour-plan to set it state Completed', () => {
    tourPlanAdminPO.switchToTab(ImitationOrder.states.paid.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.paid.name
    ].gotoTheThingView(TourPlanPaid);
    tourPlanView.expectVisible();
    tourPlanView.expectState(ImitationOrder.states.paid.label);
    tourPlanView.setState(TourPlanPaid, ImitationTourPlan.states.completed);
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
    tourPlanView.expectVisible();
    tourPlanView.expectState(ImitationOrder.states.completed.label);
  });

  it('Filter tour-plans by month', () => {
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
