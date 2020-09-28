import { ImitationTourPlan } from '@ygg/playwhat/core';
import {
  forgeTourPlansByState,
  SiteNavigator,
  TourPlanAdminPageObjectCypress,
  TourPlanPageObjectCypress
} from '@ygg/playwhat/test';
import { Html } from '@ygg/shared/omni-types/core';
import {
  getCurrentUser,
  login,
  theMockDatabase
} from '@ygg/shared/test/cypress';
import { Comment } from '@ygg/shared/thread/core';
import { CommentListPageObjectCypress } from '@ygg/shared/thread/test';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import { loginTestUser, logout, testUsers } from '@ygg/shared/user/test';
import { TheThing } from '@ygg/the-thing/core';
import { MyThingsDataTablePageObjectCypress } from '@ygg/the-thing/test';
import promisify from 'cypress-promise';
import { values } from 'lodash';
import { beforeAll } from '../../support/before-all';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import { TourPlanWithPlaysAndEquipments } from './sample-tour-plan';

const siteNavigator = new SiteNavigator();
const tourPlanAdminPO = new TourPlanAdminPageObjectCypress();
const tourPlanPO = new TourPlanPageObjectCypress();
const myTourPlansPO = new MyThingsDataTablePageObjectCypress(
  '',
  ImitationTourPlan
);
const commentsPO = new CommentListPageObjectCypress();

const tourPlan = TourPlanWithPlaysAndEquipments.clone();
tourPlan.name = `測試遊程(付款流程)_${Date.now()}`;
ImitationTourPlan.setState(tourPlan, ImitationTourPlan.states.approved);
const tourPlansByState = forgeTourPlansByState();
const SampleThings = SamplePlays.concat(SampleEquipments).concat([
  tourPlan,
  ...values(tourPlansByState)
]);

// let incomeRecord: IncomeRecord;

const me: User = testUsers[0];
const admin: User = testUsers[1];

describe('Tour-plan scenario of pushing into state paid', () => {
  before(() => {
    beforeAll();
    theMockDatabase.setAdmins([admin.id]);
    cy.wrap(SampleThings).each((thing: any) => {
      thing.ownerId = me.id;
      theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
    });
    cy.visit('/');
    loginTestUser(admin);
  });

  after(() => {
    theMockDatabase.clear();
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

  it('Log action confirm-paid to a new comment', () => {
    const commentLog = new Comment({
      subjectId: tourPlan.id,
      ownerId: admin.id,
      content: new Html(
        `📌 ${admin.name} 更改狀態 ${ImitationTourPlan.states.approved.label} ➡ ${ImitationTourPlan.states.paid.label}`
      )
    });
    commentsPO.expectLatestComment(commentLog);
  });

  it('Can not confirm-paid if not admin', () => {
    logout();
    loginTestUser(me);
    for (const state of values(ImitationTourPlan.states)) {
      const tourPlanByState = tourPlansByState[state.name];
      siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
      myTourPlansPO.theThingDataTablePO.gotoTheThingView(tourPlanByState);
      tourPlanPO.expectVisible();
      tourPlanPO.theThingPO.expectState(state);
      tourPlanPO.theThingPO.expectNoActionButton(
        ImitationTourPlan.actions['confirm-paid']
      );
    }
  });

  // it('Can mark paid only if admin and in state approved', async () => {
  //   for (const state of values(ImitationTourPlan.states)) {
  //     await promisify(
  //       cy.wrap(
  //         new Cypress.Promise((resolve, reject) => {
  //           cy.log(`Set state of ${tourPlan.id}: ${state.name}`);
  //           ImitationTourPlan.setState(tourPlan, state);
  //           // console.log(ImitationTourPlan.getState(tourPlan));
  //           // Change state in mocked database
  //           theMockDatabase
  //             .insert(`${tourPlan.collection}/${tourPlan.id}`, tourPlan)
  //             .then(() => {
  //               tourPlanPO.theThingPO.expectState(state);
  //               if (state.name === ImitationTourPlan.states.approved.name) {
  //                 // Only show action button in state editing
  //                 tourPlanPO.theThingPO.expectActionButton(
  //                   ImitationTourPlan.actions['confirm-paid']
  //                 );
  //               } else {
  //                 tourPlanPO.theThingPO.expectNoActionButton(
  //                   ImitationTourPlan.actions['confirm-paid']
  //                 );
  //               }
  //               resolve();
  //             });
  //         }),
  //         { timeout: 20000 }
  //       )
  //     );
  //   }

  //   // Deprive login user from admin
  //   await promisify(
  //     cy.wrap(
  //       new Cypress.Promise((resolve, reject) => {
  //         theMockDatabase.setAdmins([]).then(() => {
  //           // cy.pause();
  //           tourPlanPO.theThingPO.expectNoActionButton(
  //             ImitationTourPlan.actions['confirm-paid']
  //           );
  //           resolve();
  //         });
  //       }),
  //       { timeout: 20000 }
  //     )
  //   );
  // });
});
