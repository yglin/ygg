import { ImitationTourPlan } from '@ygg/playwhat/core';
import {
  SiteNavigator,
  TourPlanAdminPageObjectCypress,
  TourPlanPageObjectCypress
} from '@ygg/playwhat/test';
import { Month, Html } from '@ygg/shared/omni-types/core';
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
import { waitForLogin } from '@ygg/shared/user/test';
import { Comment } from "@ygg/shared/thread/core";
import { CommentListPageObjectCypress } from '@ygg/shared/thread/test';

const tourPlansByStateAndMonth: {
  [state: string]: TheThing[];
} = stubTourPlansByStateAndMonth();

const siteNavigator = new SiteNavigator();
const SampleTourPlans = [TourPlanInApplication, TourPlanPaid].concat(
  flatten(values(tourPlansByStateAndMonth))
);

const tourPlan = TourPlanWithPlaysAndEquipments.clone();
tourPlan.name = `測試遊程(全部完成流程)`;
ImitationTourPlan.setState(tourPlan, ImitationTourPlan.states.paid);
const SampleThings = SamplePlays.concat(SampleEquipments).concat([tourPlan]);

const tourPlanAdminPO = new TourPlanAdminPageObjectCypress();
const tourPlanPO = new TourPlanPageObjectCypress();
const myTourPlansPO = new MyThingsDataTablePageObjectCypress(
  '',
  ImitationTourPlan
);
const commentsPO = new CommentListPageObjectCypress();
// let incomeRecord: IncomeRecord;

describe('Tour-plan senario for state completed', () => {
  before(() => {
    login().then(user => {
      theMockDatabase.setAdmins([user.id]);
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });
      cy.visit('/');
      waitForLogin();
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

  it('Complete tour-plan by set it state Completed', () => {
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(ImitationTourPlan.states.paid.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.paid.name
    ].gotoTheThingView(tourPlan);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.paid);
    tourPlanPO.theThingPO.runAction(
      ImitationTourPlan.actions['confirm-completed']
    );
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(
      `確定此遊程 ${tourPlan.name} 的所有活動行程已結束，標記為已完成？`
    );
    emceePO.alert(`遊程 ${tourPlan.name} 標記為已完成。`);
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.completed);
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(ImitationTourPlan.states.paid.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.paid.name
    ].expectNotTheThing(tourPlan);
    tourPlanAdminPO.switchToTab(ImitationTourPlan.states.completed.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.completed.name
    ].expectTheThing(tourPlan);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.completed.name
    ].gotoTheThingView(tourPlan);
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.completed);
  });

  it('Log action confirm-completed to a new comment', () => {
    getCurrentUser().then(user => {
      const commentLog = new Comment({
        subjectId: tourPlan.id,
        ownerId: user.id,
        content: new Html(
          `📌 ${user.name} 更改狀態 ${ImitationTourPlan.states.paid.label} ➡ ${ImitationTourPlan.states.completed.label}`
        )
      });
      commentsPO.expectLatestComment(commentLog);
    });
  });

  it('Can mark completed only if admin and in state paid', async () => {
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
                if (state.name === ImitationTourPlan.states.paid.name) {
                  // Only show action button in state editing
                  tourPlanPO.theThingPO.expectActionButton(
                    ImitationTourPlan.actions['confirm-completed']
                  );
                } else {
                  tourPlanPO.theThingPO.expectNoActionButton(
                    ImitationTourPlan.actions['confirm-completed']
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
              ImitationTourPlan.actions['confirm-completed']
            );
            resolve();
          });
        }),
        { timeout: 20000 }
      )
    );
  });
});
