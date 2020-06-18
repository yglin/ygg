// import { sampleSize, values, pick, sum, sumBy, random, find } from 'lodash';
import { ImitationPlay, ImitationTourPlan } from '@ygg/playwhat/core';
import { SiteNavigator, TourPlanPageObjectCypress } from '@ygg/playwhat/test';
import { login, logout, theMockDatabase } from '@ygg/shared/test/cypress';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';
import { ShoppingCartEditorPageObjectCypress } from '@ygg/shopping/test';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import {
  MyThingsDataTablePageObjectCypress,
  TheThingPageObjectCypress
} from '@ygg/the-thing/test';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import {
  MinimalTourPlan,
  TourPlanFull,
  TourPlanWithPlaysNoEquipment
} from './sample-tour-plan';

describe('Edit exist tour-plans from my-tour-plans page', () => {
  const siteNavigator = new SiteNavigator();
  const SampleTourPlans = [
    MinimalTourPlan,
    TourPlanFull,
    TourPlanWithPlaysNoEquipment
  ];
  const SampleThings = SamplePlays.concat(SampleEquipments).concat(
    SampleTourPlans
  );

  const cartPO = new ShoppingCartEditorPageObjectCypress();
  const imageThumbnailListPO = new ImageThumbnailListPageObjectCypress();
  const tourPlanPO = new TourPlanPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress(
    '',
    ImitationTourPlan
  );
  const playPO = new TheThingPageObjectCypress('', ImitationPlay);

  before(() => {
    login().then(user => {
      MinimalTourPlan.ownerId = user.id;
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });
      cy.visit('/');
    });
  });

  beforeEach(() => {
    // login().then(user => {
    //   // MinimalTourPlan.ownerId = user.id;
    //   cy.wrap(SampleThings).each((thing: any) => {
    //     thing.ownerId = user.id;
    //     theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
    //   });
    // });
    // Reset MinimalTourPlan
    theMockDatabase.insert(
      `${TheThing.collection}/${MinimalTourPlan.id}`,
      MinimalTourPlan
    );
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(MinimalTourPlan);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(MinimalTourPlan);
    tourPlanPO.expectVisible();
    // cy.visit('/');
  });

  // afterEach(() => {
  //   theMockDatabase.clear();
  // });

  after(() => {
    // // Goto my-things page and delete all test things
    // const myThingsPO = new MyThingsPageObjectCypress();
    // siteNavigator.goto(['the-things', 'my'], myThingsPO);
    // cy.wait(3000);
    // myThingsPO.deleteAll();

    theMockDatabase.clear();
  });

  it('Edit exist tour-plan with full data', () => {
    tourPlanPO.expectVisible();
    const newCells = TourPlanFull.getCellsByNames(
      ImitationTourPlan.getOptionalCellNames()
    );
    tourPlanPO.theThingPO.setValue(TourPlanFull);
    tourPlanPO.theThingPO.save(TourPlanFull);
    tourPlanPO.expectValue(TourPlanFull);
  });

  it('Edit tour-plan, remove optional cells', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanFull);
    tourPlanPO.expectVisible();
    tourPlanPO.expectValue(TourPlanFull);
    const cells2BDel: TheThingCell[] = TourPlanFull.getCellsByNames(
      ImitationTourPlan.getOptionalCellNames()
    );
    for (const cell of cells2BDel) {
      tourPlanPO.deleteCell(cell);
    }
    tourPlanPO.theThingPO.save(TourPlanFull);

    // const resultTourPlan = TourPlanFull.clone();
    // resultTourPlan.deleteCells(cells2BDel);
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanFull);
    tourPlanPO.expectVisible();
    tourPlanPO.expectNoCells(cells2BDel);
  });

  it('Can not modify if not owner', () => {
    logout().then(() => {
      cy.visit(`${ImitationTourPlan.routePath}/${MinimalTourPlan.id}`);
      tourPlanPO.expectVisible();
      tourPlanPO.expectReadonly();
    });
  });
});
