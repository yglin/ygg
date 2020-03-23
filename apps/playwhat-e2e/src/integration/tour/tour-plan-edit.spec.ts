// import { sampleSize, values, pick, sum, sumBy, random, find } from 'lodash';
import { MockDatabase, login } from '@ygg/shared/test/cypress';
import {
  MinimalTourPlan,
  TourPlanFull,
  TourPlanWithPlaysAndAdditions
} from './sample-tour-plan';
import { SamplePlays, SampleAdditions } from '../play/sample-plays';
import {
  MyThingsDataTablePageObjectCypress,
  MyThingsPageObjectCypress
} from '@ygg/the-thing/test';
import {
  TourPlanViewPageObjectCypress,
  TourPlanBuilderPageObjectCypress
} from '@ygg/playwhat/test';
import { SiteNavigator } from '@ygg/playwhat/test';
import { TheThing } from '@ygg/the-thing/core';

describe('Edit exist tour-plans from my-tour-plans page', () => {
  let mockDatabase: MockDatabase;
  const siteNavigator = new SiteNavigator();
  const SampleTourPlans = [MinimalTourPlan];
  const SampleThings = SamplePlays.concat(SampleAdditions).concat(
    SampleTourPlans
  );

  const tourPlanBuilderPO = new TourPlanBuilderPageObjectCypress();
  const tourPlanViewPO = new TourPlanViewPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress();

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
    // Reset MinimalTourPlan
    mockDatabase.insert(
      `${TheThing.collection}/${MinimalTourPlan.id}`,
      MinimalTourPlan.toJSON()
    );
  });

  after(() => {
    // Goto my-things page and delete all test things
    const myThingsPO = new MyThingsPageObjectCypress();
    siteNavigator.goto(['the-things', 'my'], myThingsPO);
    cy.wait(3000);
    myThingsPO.deleteAll();

    mockDatabase.clear();
    mockDatabase.restoreRTDB();
  });

  it('Click edit button in my-tour-plans page, should goto tour-plan-builder', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    // cy.pause();
    myTourPlansPO.theThingDataTablePO.expectTheThing(MinimalTourPlan);
    myTourPlansPO.theThingDataTablePO.gotoTheThingEdit(MinimalTourPlan);
    tourPlanBuilderPO.expectVisible();
    tourPlanBuilderPO.reset();
    tourPlanBuilderPO.skipToFinalStep();
    tourPlanBuilderPO.submit();
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(MinimalTourPlan);
  });

  it('Edit exist tour-plan with full data', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(MinimalTourPlan);
    myTourPlansPO.theThingDataTablePO.gotoTheThingEdit(MinimalTourPlan);
    tourPlanBuilderPO.expectVisible();
    tourPlanBuilderPO.reset();
    tourPlanBuilderPO.setValue(TourPlanFull, { things: SampleThings });
    tourPlanBuilderPO.submit();

    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(TourPlanFull, { things: SampleThings });
  });

  it('Edit exist tour-plan with purchasing plays and additions', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(MinimalTourPlan);
    myTourPlansPO.theThingDataTablePO.gotoTheThingEdit(MinimalTourPlan);
    tourPlanBuilderPO.expectVisible();
    tourPlanBuilderPO.reset();
    tourPlanBuilderPO.setValue(TourPlanWithPlaysAndAdditions, {
      things: SampleThings
    });
    tourPlanBuilderPO.submit();

    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(TourPlanWithPlaysAndAdditions, {
      things: SampleThings
    });
  });
});
