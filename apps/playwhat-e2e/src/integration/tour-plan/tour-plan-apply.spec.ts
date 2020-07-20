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
  TourPlanWithPlaysAndEquipments,
  TourPlanWithPlaysNoEquipment
} from './sample-tour-plan';
import promisify from 'cypress-promise';
import { symlink } from 'fs';

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
tourPlan.name = `測試遊程(送出申請流程)_${Date.now()}`;
ImitationTourPlan.setState(tourPlan, ImitationTourPlan.states.editing);
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

describe('Tour-plan scenario of applying to admin assessment', () => {
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

  beforeEach(() => {
    // // Reset tour-plan states
    // getCurrentUser().then(user => {
    //   theMockDatabase.setAdmins([user.id]);
    //   cy.wrap(values(tourPlansByState)).each((tourPlan: any) => {
    //     theMockDatabase.insert(`${TheThing.collection}/${tourPlan.id}`, tourPlan);
    //   });
    //   cy.visit('/');
    // });
    // // Back to home
    // siteNavigator.goto();
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Send tour-plan of state "editing" for application ', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(tourPlan);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.editing);
    tourPlanPO.theThingPO.runAction(
      ImitationTourPlan.actions['send-application']
    );
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(
      `將此遊程 ${tourPlan.name} 送出申請？一旦送出便無法再修改資料`
    );
    emceePO.alert(`遊程 ${tourPlan.name} 已送出申請，等待管理者審核。`);
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.applied);
    // Expect the submitted tour-plan show up in administrator's list
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    // tourPlanDataTablePO.expectTheThing(MinimalTourPlan);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.applied.name
    ].expectTheThing(tourPlan);
  });

  it('Cancel applied tour-plan, set it back to state "editing"', () => {
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.applied.name
    ].gotoTheThingView(tourPlan);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.applied);
    tourPlanPO.theThingPO.runAction(
      ImitationTourPlan.actions['cancel-application']
    );
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(`取消此遊程 ${tourPlan.name} 的申請並退回修改狀態？`);
    emceePO.alert(`遊程 ${tourPlan.name} 已取消申請並退回修改`);
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.editing);
  });

  it('Can send application only if owner and in state editing', async () => {
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
                if (state.name === ImitationTourPlan.states.editing.name) {
                  // Only show action button in state editing
                  tourPlanPO.theThingPO.expectActionButton(
                    ImitationTourPlan.actions['send-application']
                  );
                } else {
                  tourPlanPO.theThingPO.expectNoActionButton(
                    ImitationTourPlan.actions['send-application']
                  );
                }
                resolve();
              });
          }),
          { timeout: 20000 }
        )
      );
    }

    // Set owner as someone else
    await promisify(
      cy.wrap(
        new Cypress.Promise((resolve, reject) => {
          tourPlan.ownerId = 'Someone else';
          theMockDatabase
            .insert(`${tourPlan.collection}/${tourPlan.id}`, tourPlan)
            .then(() => {
              tourPlanPO.theThingPO.expectNoActionButton(
                ImitationTourPlan.actions['send-application']
              );
              resolve();
            });
        }),
        { timeout: 20000 }
      )
    );
  });
});
