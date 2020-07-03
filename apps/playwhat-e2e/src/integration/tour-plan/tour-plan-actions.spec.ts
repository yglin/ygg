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

const tourPlansByStateAndMonth: {
  [state: string]: TheThing[];
} = stubTourPlansByStateAndMonth();

const siteNavigator = new SiteNavigator();
const SampleTourPlans = [TourPlanInApplication, TourPlanPaid].concat(
  flatten(values(tourPlansByStateAndMonth))
);

const tourPlansByState = mapValues(ImitationTourPlan.states, state => {
  const tourPlan = TourPlanWithPlaysAndEquipments.clone();
  tourPlan.name = `測試遊程狀態：${state.label}`;
  ImitationTourPlan.setState(tourPlan, state);
  return tourPlan;
});

const SampleThings = SamplePlays.concat(SampleEquipments)
  .concat(SampleTourPlans)
  .concat(values(tourPlansByState));

const tourPlanAdminPO = new TourPlanAdminPageObjectCypress();
const tourPlanPO = new TourPlanPageObjectCypress();
const myTourPlansPO = new MyThingsDataTablePageObjectCypress(
  '',
  ImitationTourPlan
);
// let incomeRecord: IncomeRecord;

describe('Tour-plan compatible actions', () => {
  before(() => {
    login().then(user => {
      theMockDatabase.setAdmins([user.id]);
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });
      cy.visit('/');
    })
  });

  beforeEach(() => {
    // Reset tour-plan states
    getCurrentUser().then(user => {
      theMockDatabase.setAdmins([user.id]);
      cy.wrap(values(tourPlansByState)).each((tourPlan: any) => {
        theMockDatabase.insert(`${TheThing.collection}/${tourPlan.id}`, tourPlan);
      });
      cy.visit('/');
    });
  });

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

  it('State of just created tour-plan should be "new"', () => {
    siteNavigator.goto([ImitationTourPlan.routePath, 'create']);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.new);
  });

  it('State of saved tourPlan should be "editing"', () => {
    const tourPlan = MinimalTourPlan.clone();
    tourPlan.name = `測試已儲存遊程的狀態=修改中_${Date.now()}`;
    siteNavigator.goto([ImitationTourPlan.routePath, 'create']);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.setValue(tourPlan);
    tourPlanPO.theThingPO.save(tourPlan);
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.editing);
    const myThingsPO = new MyThingsPageObjectCypress();
    siteNavigator.goto(['the-things', 'my'], myThingsPO);
    myThingsPO.deleteThings([tourPlan]);
  });

  it('Send tour-plan of state "editing" for application ', () => {
    const tourPlan = tourPlansByState[ImitationTourPlan.states.editing.name];
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
    const tourPlan = tourPlansByState[ImitationTourPlan.states.applied.name];
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(ImitationTourPlan.states.applied.name);
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

  it('Approve tour-plan by set it state approved', () => {
    const tourPlan = tourPlansByState[ImitationTourPlan.states.applied.name];
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(ImitationTourPlan.states.applied.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.applied.name
    ].gotoTheThingView(tourPlan);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.applied);
    tourPlanPO.theThingPO.runAction(
      ImitationTourPlan.actions['approve-available']
    );
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(
      `確定遊程 ${tourPlan.name} 有充分的資源和時間可成團，標記為可成行並等待付款？`
    );
    emceePO.alert(`遊程 ${tourPlan.name} 已標記為可成行。`);
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.approved);
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(ImitationTourPlan.states.applied.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.applied.name
    ].expectNotTheThing(tourPlan);
    tourPlanAdminPO.switchToTab(ImitationTourPlan.states.approved.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.approved.name
    ].expectTheThing(tourPlan);
  });

  it('Approve tour-plan as paid by set it state Paid', () => {
    const tourPlan = tourPlansByState[ImitationTourPlan.states.approved.name];
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
  });

  it('Complete tour-plan by set it state Completed', () => {
    const tourPlan = tourPlansByState[ImitationTourPlan.states.paid.name];
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
      `確定此遊程 ${tourPlan.name} 的所有活動流程已結束，標記為已完成？`
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
  });

  it('Filter tour-plans by month', () => {
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    cy.wrap(keys(tourPlansByStateAndMonth)).each((stateName: any) => {
      tourPlanAdminPO.switchToTab(stateName);
      const tourPlans = tourPlansByStateAndMonth[stateName];
      cy.wrap(tourPlans).each((tourPlan: any, index: number) => {
        const offset = -index;
        tourPlanAdminPO.selectMonth(Month.fromMonthOffset(offset));
        const theThingDataTablePO =
          tourPlanAdminPO.theThingDataTables[stateName];
        theThingDataTablePO.expectTheThing(tourPlan);
      });
    });
  });
});
