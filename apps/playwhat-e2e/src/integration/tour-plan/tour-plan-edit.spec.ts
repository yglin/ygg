// import { sampleSize, values, pick, sum, sumBy, random, find } from 'lodash';
import { MockDatabase, login, theMockDatabase } from '@ygg/shared/test/cypress';
import {
  MinimalTourPlan,
  TourPlanFull,
  TourPlanWithPlaysAndAdditions
} from './sample-tour-plan';
import {
  SamplePlays,
  SampleAdditions,
  PlaysWithoutAddition,
  PlaysWithAddition
} from '../play/sample-plays';
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
import { ImitationTourPlan, ImitationPlay } from '@ygg/playwhat/core';
import { RelationNamePurchase, Purchase } from '@ygg/shopping/core';
import { IPurchasePack } from '@ygg/shopping/ui';

describe('Edit exist tour-plans from my-tour-plans page', () => {
  const siteNavigator = new SiteNavigator();
  const SampleTourPlans = [MinimalTourPlan];
  const SampleThings = SamplePlays.concat(SampleAdditions).concat(
    SampleTourPlans
  );

  const tourPlanBuilderPO = new TourPlanBuilderPageObjectCypress();
  const tourPlanViewPO = new TourPlanViewPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress();

  // before(() => {
  //   login().then(user => {
  //     MinimalTourPlan.ownerId = user.id;
  //     cy.wrap(SampleThings).each((thing: any) => {
  //       thing.ownerId = user.id;
  //       theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
  //     });
  //   });
  // });

  beforeEach(() => {
    login().then(user => {
      // MinimalTourPlan.ownerId = user.id;
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });
    });
    // // Reset MinimalTourPlan
    // theMockDatabase.insert(
    //   `${TheThing.collection}/${MinimalTourPlan.id}`,
    //   MinimalTourPlan
    // );
    cy.visit('/');
  });

  afterEach(() => {
    theMockDatabase.clear();
  });

  after(() => {
    // // Goto my-things page and delete all test things
    // const myThingsPO = new MyThingsPageObjectCypress();
    // siteNavigator.goto(['the-things', 'my'], myThingsPO);
    // cy.wait(3000);
    // myThingsPO.deleteAll();

    theMockDatabase.clear();
  });

  it('Edit exist tour-plan with full data', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(MinimalTourPlan);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(MinimalTourPlan);

    tourPlanViewPO.expectVisible();
    const newCells = TourPlanFull.getCellsByNames(
      ImitationTourPlan.getOptionalCellNames()
    );
    tourPlanViewPO.setValue(TourPlanFull, { newCells });
    tourPlanViewPO.save();
    tourPlanViewPO.expectValue(TourPlanFull);
  });

  it('Edit exist tour-plan with purchasing plays and additions', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(MinimalTourPlan);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(MinimalTourPlan);
    tourPlanViewPO.expectVisible();

    const finalList: Purchase[] = TourPlanWithPlaysAndAdditions.getRelations(
      RelationNamePurchase
    ).map(r => Purchase.fromRelation(r));
    const purchasedPlays: TheThing[] = PlaysWithAddition;

    const newPurchases: IPurchasePack = {
      things: purchasedPlays,
      filter: ImitationPlay.filter,
      finalList
    };

    tourPlanViewPO.setValue(TourPlanWithPlaysAndAdditions, {
      newPurchases
    });
    tourPlanViewPO.expectValue(TourPlanWithPlaysAndAdditions);
  });
});
