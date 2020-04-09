// import { sampleSize, values, pick, sum, sumBy, random, find } from 'lodash';
import { MockDatabase, login, theMockDatabase } from '@ygg/shared/test/cypress';
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
  const siteNavigator = new SiteNavigator();
  const SampleTourPlans = [MinimalTourPlan];
  const SampleThings = SamplePlays.concat(SampleAdditions).concat(
    SampleTourPlans
  );

  const tourPlanBuilderPO = new TourPlanBuilderPageObjectCypress();
  const tourPlanViewPO = new TourPlanViewPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress();

  before(() => {
    login().then(user => {
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });
    });
  });

  beforeEach(() => {
    // Reset MinimalTourPlan
    theMockDatabase.insert(
      `${TheThing.collection}/${MinimalTourPlan.id}`,
      MinimalTourPlan
    );
    cy.visit('/');
  });

  after(() => {
    // // Goto my-things page and delete all test things
    // const myThingsPO = new MyThingsPageObjectCypress();
    // siteNavigator.goto(['the-things', 'my'], myThingsPO);
    // cy.wait(3000);
    // myThingsPO.deleteAll();

    theMockDatabase.clear();
  });

  it('Click edit button in my-tour-plans page, should goto tour-plan-builder', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    // cy.pause();
    myTourPlansPO.theThingDataTablePO.expectTheThing(MinimalTourPlan);
    myTourPlansPO.theThingDataTablePO.gotoTheThingEdit(MinimalTourPlan);
    tourPlanBuilderPO.expectVisible();
    tourPlanBuilderPO.expectStepFinal();
    tourPlanBuilderPO.submit();
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(MinimalTourPlan);
  });

  it('Edit exist tour-plan with full data', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(MinimalTourPlan);
    myTourPlansPO.theThingDataTablePO.gotoTheThingEdit(MinimalTourPlan);
    tourPlanBuilderPO.expectVisible();
    tourPlanBuilderPO.expectStepFinal();
    tourPlanBuilderPO.prev();
    tourPlanBuilderPO.prev();
    tourPlanBuilderPO.expectStep(1);
    tourPlanBuilderPO.setValue(TourPlanFull, { hasOptionalFields: true });
    tourPlanBuilderPO.submit();

    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(TourPlanFull);
  });

  it('Edit exist tour-plan with purchasing plays and additions', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(MinimalTourPlan);
    myTourPlansPO.theThingDataTablePO.gotoTheThingEdit(MinimalTourPlan);
    tourPlanBuilderPO.expectVisible();
    tourPlanBuilderPO.expectStepFinal();
    tourPlanBuilderPO.prev();
    tourPlanBuilderPO.prev();
    tourPlanBuilderPO.expectStep(1);
    tourPlanBuilderPO.setValue(TourPlanWithPlaysAndAdditions, {
      hasOptionalFields: true
    });
    tourPlanBuilderPO.submit();

    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(TourPlanWithPlaysAndAdditions);
  });
});
