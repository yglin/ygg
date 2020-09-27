import { ImitationTourPlan } from '@ygg/playwhat/core';
import {
  SiteNavigator,
  TourPlanAdminPageObjectCypress,
  TourPlanPageObjectCypress
} from '@ygg/playwhat/test';
import { Html } from '@ygg/shared/omni-types/core';
import { theMockDatabase } from '@ygg/shared/test/cypress';
import { Comment } from '@ygg/shared/thread/core';
import { CommentListPageObjectCypress } from '@ygg/shared/thread/test';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import { loginTestUser, logout, testUsers } from '@ygg/shared/user/test';
import { MyThingsDataTablePageObjectCypress } from '@ygg/the-thing/test';
import { mapValues, values } from 'lodash';
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

const SampleThings = SamplePlays.concat(SampleEquipments);

const tourPlan = TourPlanWithPlaysAndEquipments.clone();
tourPlan.name = `測試遊程(全部完成流程)_${Date.now()}`;
ImitationTourPlan.setState(tourPlan, ImitationTourPlan.states.paid);

const tourPlansByState = mapValues(ImitationTourPlan.states, state => {
  const tourPlanByState = TourPlanWithPlaysAndEquipments.clone();
  tourPlanByState.name = `測試遊程狀態：${state.label}_${Date.now()}`;
  ImitationTourPlan.setState(tourPlanByState, state);
  return tourPlanByState;
});
const SampleTourPlans = [tourPlan, ...values(tourPlansByState)];
SampleThings.push(...SampleTourPlans);

// let incomeRecord: IncomeRecord;

const me: User = testUsers[0];
const admin: User = testUsers[1];

describe('Tour-plan senario for state completed', () => {
  before(() => {
    beforeAll();
    theMockDatabase.setAdmins([admin.id]);
    cy.wrap(SampleThings).each((thing: any) => {
      thing.ownerId = me.id;
      theMockDatabase.insert(`${thing.collection}/${thing.id}`, thing);
    });
    cy.visit('/');
    loginTestUser(admin);
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

  afterEach(() => {
    // theMockDatabase.clear();
  });

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
    const commentLog = new Comment({
      subjectId: tourPlan.id,
      ownerId: admin.id,
      content: new Html(
        `📌 ${admin.name} 更改狀態 ${ImitationTourPlan.states.paid.label} ➡ ${ImitationTourPlan.states.completed.label}`
      )
    });
    commentsPO.expectLatestComment(commentLog);
  });

  it('Can confirm completed only if admin and in state paid', () => {
    logout();
    loginTestUser(me);
    for (const state of values(ImitationTourPlan.states)) {
      const tourPlanByState = tourPlansByState[state.name];
      siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
      myTourPlansPO.theThingDataTablePO.gotoTheThingView(tourPlanByState);
      tourPlanPO.expectVisible();
      tourPlanPO.theThingPO.expectState(state);
      tourPlanPO.theThingPO.expectNoActionButton(
        ImitationTourPlan.actions['confirm-completed']
      );
    }

    const tourPlanPaid =
      tourPlansByState[ImitationTourPlan.states['paid'].name];
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(tourPlanPaid);
    logout();
    loginTestUser(admin);
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(ImitationTourPlan.states.paid.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.paid.name
    ].gotoTheThingView(tourPlanPaid);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states['paid']);
    tourPlanPO.theThingPO.expectActionButton(
      ImitationTourPlan.actions['confirm-completed']
    );
  });
});
