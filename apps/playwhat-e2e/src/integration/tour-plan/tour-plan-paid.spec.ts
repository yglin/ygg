import { ImitationTourPlan } from '@ygg/playwhat/core';
import {
  SiteNavigator,
  TourPlanAdminPageObjectCypress,
  TourPlanPageObjectCypress
} from '@ygg/playwhat/test';
import { Month } from '@ygg/shared/omni-types/core';
import {
  getCurrentUser,
  login,
  theMockDatabase
} from '@ygg/shared/test/cypress';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { ImitationOrder } from '@ygg/shopping/core';
import { TheThing, TheThingState } from '@ygg/the-thing/core';
import {
  MyThingsDataTablePageObjectCypress,
  MyThingsPageObjectCypress
} from '@ygg/the-thing/test';
import { flatten, keys, mapValues, values } from 'lodash';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import {
  MinimalTourPlan,
  stubTourPlansByStateAndMonth,
  TourPlanInApplication,
  TourPlanPaid,
  TourPlanWithPlaysAndEquipments
} from './sample-tour-plan';
import promisify from 'cypress-promise';

const tourPlansByStateAndMonth: {
  [state: string]: TheThing[];
} = stubTourPlansByStateAndMonth();

const siteNavigator = new SiteNavigator();
const SampleTourPlans = [TourPlanInApplication, TourPlanPaid].concat(
  flatten(values(tourPlansByStateAndMonth))
);

// const tourPlansByState = mapValues(ImitationTourPlan.states, state => {
//   const tourPlan = TourPlanWithPlaysAndEquipments.clone();
//   tourPlan.name = `測試遊程狀態：${state.label}`;
//   ImitationTourPlan.setState(tourPlan, state);
//   return tourPlan;
// });

const tourPlan = TourPlanWithPlaysAndEquipments.clone();
tourPlan.name = `測試遊程(付款流程)`;
ImitationTourPlan.setState(tourPlan, ImitationTourPlan.states.approved);
const SampleThings = SamplePlays.concat(SampleEquipments).concat([tourPlan]);
// .concat(SampleTourPlans)
// .concat(values(tourPlansByState));

const tourPlanAdminPO = new TourPlanAdminPageObjectCypress();
const tourPlanPO = new TourPlanPageObjectCypress();
const myTourPlansPO = new MyThingsDataTablePageObjectCypress(
  '',
  ImitationTourPlan
);
// let incomeRecord: IncomeRecord;

describe('Tour-plan scenario of pushing into state paid', () => {
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

  // beforeEach(() => {
  //   // Reset tour-plan states
  //   getCurrentUser().then(user => {
  //     theMockDatabase.setAdmins([user.id]);
  //     cy.wrap(values(tourPlansByState)).each((tourPlan: any) => {
  //       theMockDatabase.insert(`${TheThing.collection}/${tourPlan.id}`, tourPlan);
  //     });
  //     cy.visit('/');
  //   });
  // });

  // afterEach(() => {
  //   // theMockDatabase.clear();
  // });

  after(() => {
    // // Goto my-things page and delete previously created things
    // const myThingsPO = new MyThingsPageObjectCypress();
    // siteNavigator.goto(['the-things', 'my'], myThingsPO);
    // cy.wait(3000);
    // myThingsPO.deleteAll();
    theMockDatabase.clear();
    // theMockDatabase.restoreRTDB();
  });

  it('Mark tour-plan as paid by set it state Paid', () => {
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(ImitationTourPlan.states.approved.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.approved.name
    ].gotoTheThingView(tourPlan);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.approved);
    tourPlanPO.theThingPO.runAction(ImitationTourPlan.actions['confirm-paid']);
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(
      `確定此遊程 ${tourPlan.name} 的所有款項已付清，標記為已付款？`
    );
    emceePO.alert(`遊程 ${tourPlan.name} 標記為已付款。`);
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.paid);
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(ImitationTourPlan.states.approved.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.approved.name
    ].expectNotTheThing(tourPlan);
    tourPlanAdminPO.switchToTab(ImitationTourPlan.states.paid.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.paid.name
    ].expectTheThing(tourPlan);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.paid.name
    ].gotoTheThingView(tourPlan);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.paid);
  });

  it('Can mark paid only if admin and in state approved', async () => {
    for (const state of values(ImitationTourPlan.states)) {
      await promisify(
        cy.wrap(
          new Cypress.Promise((resolve, reject) => {
            cy.log(`Set state of ${tourPlan.id}: ${state.name}`);
            ImitationTourPlan.setState(tourPlan, state);
            // console.log(ImitationTourPlan.getState(tourPlan));
            // Change state in mocked database
            theMockDatabase
              .insert(`${tourPlan.collection}/${tourPlan.id}`, tourPlan)
              .then(() => {
                tourPlanPO.theThingPO.expectState(state);
                if (state.name === ImitationTourPlan.states.approved.name) {
                  // Only show action button in state editing
                  tourPlanPO.theThingPO.expectActionButton(
                    ImitationTourPlan.actions['confirm-paid']
                  );
                } else {
                  tourPlanPO.theThingPO.expectNoActionButton(
                    ImitationTourPlan.actions['confirm-paid']
                  );
                }
                resolve();
              });
          }),
          { timeout: 20000 }
        )
      );
    }

    // Deprive login user from admin
    await promisify(
      cy.wrap(
        new Cypress.Promise((resolve, reject) => {
          theMockDatabase.setAdmins([]).then(() => {
            // cy.pause();
            tourPlanPO.theThingPO.expectNoActionButton(
              ImitationTourPlan.actions['confirm-paid']
            );
            resolve();
          });
        }),
        { timeout: 20000 }
      )
    );
  });
});
