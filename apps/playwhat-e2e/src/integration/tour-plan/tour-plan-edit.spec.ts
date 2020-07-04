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
  TourPlanWithPlaysNoEquipment,
  TourPlanWithPlaysAndEquipments
} from './sample-tour-plan';
import { waitForLogin } from '@ygg/shared/user/test';
import { values } from 'lodash';
import promisify from 'cypress-promise';

describe('Edit exist tour-plans from my-tour-plans page', () => {
  const siteNavigator = new SiteNavigator();
  // const SampleTourPlans = [
  //   MinimalTourPlan,
  //   TourPlanWithPlaysNoEquipment
  // ];

  // const cartPO = new ShoppingCartEditorPageObjectCypress();
  // const imageThumbnailListPO = new ImageThumbnailListPageObjectCypress();
  const tourPlanPO = new TourPlanPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress(
    '',
    ImitationTourPlan
  );
  // const playPO = new TheThingPageObjectCypress('', ImitationPlay);
  const tourPlan = TourPlanFull.clone();
  tourPlan.name = `測試遊程(修改資料)_${Date.now()}`;
  ImitationTourPlan.setState(tourPlan, ImitationTourPlan.states.new);
  const SampleThings = SamplePlays.concat(SampleEquipments).concat([
    MinimalTourPlan,
    tourPlan
  ]);

  before(() => {
    login().then(user => {
      MinimalTourPlan.ownerId = user.id;
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });
      cy.visit('/');
      waitForLogin();
    });
  });

  // beforeEach(() => {
  // login().then(user => {
  //   // MinimalTourPlan.ownerId = user.id;
  //   cy.wrap(SampleThings).each((thing: any) => {
  //     thing.ownerId = user.id;
  //     theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
  //   });
  // });
  // Reset MinimalTourPlan
  // tourPlanPO.expectVisible();
  // cy.visit('/');
  // });

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
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(MinimalTourPlan);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(MinimalTourPlan);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.setValue(TourPlanFull);
    tourPlanPO.theThingPO.save(TourPlanFull);
    tourPlanPO.expectValue(TourPlanFull);
  });

  it('Edit tour-plan, remove optional cells', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(tourPlan);
    tourPlanPO.expectVisible();
    tourPlanPO.expectValue(tourPlan);
    const cells2BDel: TheThingCell[] = tourPlan.getCellsByNames(
      ImitationTourPlan.getOptionalCellNames()
    );
    for (const cell of cells2BDel) {
      tourPlanPO.deleteCell(cell);
    }
    tourPlanPO.theThingPO.save(tourPlan);

    // const resultTourPlan = tourPlan.clone();
    // resultTourPlan.deleteCells(cells2BDel);
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(tourPlan);
    tourPlanPO.expectVisible();
    tourPlanPO.expectNoCells(cells2BDel);
  });

  it('Editable in state new', () => {
    ImitationTourPlan.setState(tourPlan, ImitationTourPlan.states.new);
    theMockDatabase
      .insert(`${tourPlan.collection}/${tourPlan.id}`, tourPlan)
      .then(() => {
        tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.new);
        tourPlanPO.expectEditable();
      });
  });

  it('Editable in state editing', () => {
    ImitationTourPlan.setState(tourPlan, ImitationTourPlan.states.editing);
    theMockDatabase
      .insert(`${tourPlan.collection}/${tourPlan.id}`, tourPlan)
      .then(() => {
        tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.editing);
        tourPlanPO.expectEditable();
      });
  });

  it('Readonly in other states', async () => {
    const otherStates = values(ImitationTourPlan.states).filter(
      state =>
        !(
          state.name === ImitationTourPlan.states.new.name ||
          state.name === ImitationTourPlan.states.editing.name
        )
    );
    for (const state of otherStates) {
      await promisify(
        cy.wrap(
          new Cypress.Promise((resolve, reject) => {
            cy.log(`Set state of ${tourPlan.id}: ${state.name}`);
            ImitationTourPlan.setState(tourPlan, state);
            // console.log(ImitationTourPlan.getState(tourPlan));
            theMockDatabase
              .insert(`${tourPlan.collection}/${tourPlan.id}`, tourPlan)
              .then(() => {
                tourPlanPO.theThingPO.expectState(state);
                tourPlanPO.expectReadonly();
                resolve();
              });
          }),
          { timeout: 20000 }
        )
      );
    }
  });

  it('Readonly if not owner', async () => {
    tourPlan.ownerId = 'You not see me, am ghost';
    // Readonly for all state
    for (const state of values(ImitationTourPlan.states)) {
      await promisify(
        cy.wrap(
          new Cypress.Promise((resolve, reject) => {
            cy.log(`Set state of ${tourPlan.id}: ${state.name}`);
            ImitationTourPlan.setState(tourPlan, state);
            // console.log(ImitationTourPlan.getState(tourPlan));
            theMockDatabase
              .insert(`${tourPlan.collection}/${tourPlan.id}`, tourPlan)
              .then(() => {
                tourPlanPO.theThingPO.expectState(state);
                tourPlanPO.expectReadonly();
                resolve();
              });
          }),
          { timeout: 20000 }
        )
      );
    }
  });
});
