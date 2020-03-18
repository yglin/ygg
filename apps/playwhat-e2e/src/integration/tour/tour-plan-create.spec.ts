import { sampleSize, values, pick, sum, sumBy, random, find } from 'lodash';
import { MockDatabase, login } from '@ygg/shared/test/cypress';
import {
  MinimalTourPlan,
  TourPlanFull,
  TourPlanFullWithPlays,
  MinimalTourPlanWithoutName,
  TourPlanWithPlaysNoAddition,
  TourPlanWithPlaysAndAdditions
} from './sample-tour-plan';
import { SamplePlays, SampleAdditions } from '../play/sample-plays';
import {
  TheThingEditorPageObjectCypress,
  TheThingDataTablePageObjectCypress,
  MyThingsDataTablePageObjectCypress,
  TheThingViewPageObjectCypress,
  MyThingsPageObjectCypress
} from '@ygg/the-thing/test';
import {
  TourPlanViewPageObjectCypress,
  TourPlanBuilderPageObjectCypress
} from '@ygg/playwhat/test';
import { SiteNavigator } from '@ygg/playwhat/test';
import { TheThing, TheThingRelation } from '@ygg/the-thing/core';
import { Contact } from '@ygg/shared/omni-types/core';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import {
  Purchase,
  RelationNamePurchase,
  CellNameQuantity
} from '@ygg/shopping/core';

const mockDatabase = new MockDatabase();
const siteNavigator = new SiteNavigator();
const selectPlays = sampleSize(SamplePlays, 2);
let tourPlanWithPlays: TheThing;
const tourPlanFull: TheThing = TourPlanFull;
const SampleTourPlans = [
  MinimalTourPlan.clone(),
  TourPlanFullWithPlays.clone()
];
const SampleThings = SamplePlays.concat(SampleAdditions).concat(
  SampleTourPlans
);

const tourPlanBuilderPO = new TourPlanBuilderPageObjectCypress();
const tourPlanViewPO = new TourPlanViewPageObjectCypress();

describe('Tour-plan builder', () => {
  before(() => {
    tourPlanWithPlays = MinimalTourPlan.clone();
    tourPlanWithPlays.addRelations('體驗', selectPlays);
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
    tourPlanBuilderPO.reset();
    siteNavigator.goto(['tour-plans', 'builder'], tourPlanBuilderPO);
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

  it('A tour-plan without user input name should have default name', () => {
    tourPlanBuilderPO.setValue(MinimalTourPlanWithoutName, {
      things: SampleThings
    });
  });

  it('Build a tour-plan with minimal required data fields: dateRange, numParticipants, contact', () => {
    tourPlanBuilderPO.setValue(MinimalTourPlan, {
      things: SampleThings
    });
    tourPlanBuilderPO.submit();

    // Expect redirect to tour-plan view page, and check required data fields
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(MinimalTourPlan, {
      things: SampleThings
    });
  });

  it('Build a tour-plan plus includes all optional data fields', () => {
    tourPlanBuilderPO.setValue(TourPlanFull, {
      things: SampleThings
    });
    tourPlanBuilderPO.submit();

    // Expect redirect to tour-plan view page, and check required data fields
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(TourPlanFull, {
      things: SampleThings
    });
  });

  it('Build a tour-plan with a few plays selected', () => {
    tourPlanBuilderPO.setValue(TourPlanWithPlaysNoAddition, {
      things: SampleThings
    });
    tourPlanBuilderPO.submit();

    // Expect redirect to tour-plan view page, and check selected plays
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(TourPlanWithPlaysNoAddition, {
      things: SampleThings
    });
  });

  it('Build a tour-plan with a few plays selected, and setup additions', () => {
    tourPlanBuilderPO.setValue(TourPlanWithPlaysAndAdditions, {
      things: SampleThings
    });
    tourPlanBuilderPO.submit();

    // Expect redirect to tour-plan view page, and check selected plays
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(TourPlanWithPlaysAndAdditions, {
      things: SampleThings
    });
  });

  it('Save tour-plan on leave page, restore on back', () => {
    tourPlanBuilderPO.setValue(TourPlanFullWithPlays, {
      things: SampleThings
    });
    // goto other page and back immediately
    const myThingsPO = new MyThingsDataTablePageObjectCypress();
    siteNavigator.goto(['tour-plans', 'my'], myThingsPO);
    siteNavigator.goto(['tour-plans', 'builder'], tourPlanBuilderPO);

    tourPlanBuilderPO.reset();
    tourPlanBuilderPO.skipToFinalStep();
    tourPlanBuilderPO.submit();

    // Expect redirect to tour-plan view page, and check selected plays
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(TourPlanFullWithPlays, {
      things: SampleThings
    });
  });

  it('Build a tour-plan and check it out in admin page', () => {
    tourPlanBuilderPO.setValue(MinimalTourPlan, {
      things: SampleThings
    });
    tourPlanBuilderPO.submit();

    // Expect the submitted tour-plan show up in administrator's list
    const tourPlanDataTablePO = new TheThingDataTablePageObjectCypress();
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanDataTablePO);
    // tourPlanDataTablePO.expectTheThing(MinimalTourPlan);
    tourPlanDataTablePO.expectFirst(MinimalTourPlan);
    tourPlanDataTablePO.clickFirst();

    // Click the tour-plan to review it
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(MinimalTourPlan, {
      things: SampleThings
    });
  });
});
