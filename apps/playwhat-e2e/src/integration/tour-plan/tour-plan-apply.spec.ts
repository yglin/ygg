import { ImitationTourPlan } from '@ygg/playwhat/core';
import {
  forgeTourPlansByState,
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
import { TheThing } from '@ygg/the-thing/core';
import { MyThingsDataTablePageObjectCypress } from '@ygg/the-thing/test';
import { values } from 'lodash';
import { beforeAll } from '../../support/before-all';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import { TourPlanWithPlaysAndEquipments } from './sample-tour-plan';

describe('Tour-plan scenario of applying to admin assessment', () => {
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
  tourPlan.name = `測試遊程(送出申請流程)_${Date.now()}`;
  ImitationTourPlan.setState(tourPlan, ImitationTourPlan.states.editing);
  const tourPlanChanged = ImitationTourPlan.forgeTheThing();
  tourPlanChanged.name = tourPlan.name;
  SampleThings.push(tourPlan);

  // .concat(SampleTourPlans)
  // .concat(values(tourPlansByState));

  // let incomeRecord: IncomeRecord;
  const tourPlansByState = forgeTourPlansByState();
  SampleThings.push(...values(tourPlansByState));

  // const tourPlanInEditingButNotMine = TourPlanWithPlaysAndEquipments.clone();
  // ImitationTourPlan.setState(
  //   tourPlanInEditingButNotMine,
  //   ImitationTourPlan.states.editing
  // );
  // tourPlanInEditingButNotMine.ownerId = 'someone else doesnt matter';
  // SampleThings.push(tourPlanInEditingButNotMine);

  const me: User = testUsers[0];
  const admin: User = testUsers[1];

  for (const theThing of SampleThings) {
    if (!theThing.ownerId) {
      theThing.ownerId = me.id;
    }
  }

  before(() => {
    beforeAll();
    theMockDatabase.setAdmins([admin.id]);
    cy.wrap(SampleThings).each((thing: any) => {
      theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
    });
    cy.visit('/');
    loginTestUser(me);
  });
  // beforeEach(() => {
  //   // // Reset tour-plan states
  //   // getCurrentUser().then(user => {
  //   //   theMockDatabase.setAdmins([user.id]);
  //   //   cy.wrap(values(tourPlansByState)).each((tourPlan: any) => {
  //   //     theMockDatabase.insert(`${TheThing.collection}/${tourPlan.id}`, tourPlan);
  //   //   });
  //   //   cy.visit('/');
  //   // });
  //   // // Back to home
  //   // siteNavigator.goto();
  // });

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
    tourPlanPO.theThingPO.expectNoActionButton(
      ImitationTourPlan.actions['send-application']
    );
  });

  it('Log action apply to a new comment', () => {
    const commentLog = new Comment({
      subjectId: tourPlan.id,
      ownerId: me.id,
      content: new Html(
        `📌 ${me.name} 更改狀態 ${ImitationTourPlan.states.editing.label} ➡ ${ImitationTourPlan.states.applied.label}`
      )
    });
    commentsPO.expectLatestComment(commentLog);
  });

  it('Show applied tour-plan in admin page', () => {
    logout();
    loginTestUser(admin);
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
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

  it('Admin can not see the "send-application" button', () => {
    tourPlanPO.theThingPO.expectNoActionButton(
      ImitationTourPlan.actions['send-application']
    );
  });

  it('Log action cancel-apply to a new comment', () => {
    const commentLog = new Comment({
      subjectId: tourPlan.id,
      ownerId: admin.id,
      content: new Html(
        `📌 ${admin.name} 更改狀態 ${ImitationTourPlan.states.applied.label} ➡ ${ImitationTourPlan.states.editing.label}`
      )
    });
    commentsPO.expectLatestComment(commentLog);
  });

  it('Cancelled tour-plan should not in admin page', () => {
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.applied.name
    ].expectNotTheThing(tourPlan);
  });

  it('Change some data and re-apply it again', () => {
    logout();
    loginTestUser(me);
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(tourPlan);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.editing);
    tourPlanPO.theThingPO.setValue(tourPlanChanged);
    tourPlanPO.theThingPO.runAction(
      ImitationTourPlan.actions['send-application']
    );
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(
      `將此遊程 ${tourPlan.name} 送出申請？一旦送出便無法再修改資料`
    );
    emceePO.alert(`遊程 ${tourPlan.name} 已送出申請，等待管理者審核。`);
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.applied);
    tourPlanPO.theThingPO.expectNoActionButton(
      ImitationTourPlan.actions['send-application']
    );
  });

  it('The tour-plan should once again show in admin page', () => {
    logout();
    loginTestUser(admin);
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.applied.name
    ].expectTheThing(tourPlan);
  });

  it('Can send application only if owner and in state editing', () => {
    logout();
    loginTestUser(me);
    for (const state of values(ImitationTourPlan.states)) {
      const tourPlanByState = tourPlansByState[state.name];
      siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
      myTourPlansPO.theThingDataTablePO.gotoTheThingView(tourPlanByState);

      tourPlanPO.expectVisible();
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
    }
  });
});
