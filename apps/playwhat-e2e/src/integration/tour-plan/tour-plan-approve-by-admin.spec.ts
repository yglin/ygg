import {
  ImitationEvent,
  ImitationTourPlan,
  NotificationHostEvent,
  RelationshipEventService,
  RelationshipHost,
  RelationshipOrganizer,
  RelationshipScheduleEvent
} from '@ygg/playwhat/core';
import {
  MyCalendarPageObjectCypress,
  SiteNavigator,
  TourPlanAdminPageObjectCypress,
  TourPlanPageObjectCypress
} from '@ygg/playwhat/test';
import { getEnv } from '@ygg/shared/infra/core';
import { Html } from '@ygg/shared/omni-types/core';
import {
  getCurrentUser,
  logout,
  theMockDatabase
} from '@ygg/shared/test/cypress';
import { Comment } from '@ygg/shared/thread/core';
import { CommentListPageObjectCypress } from '@ygg/shared/thread/test';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { Notification, User } from '@ygg/shared/user/core';
import {
  AccountWidgetPageObjectCypress,
  loginTestUser,
  MyNotificationListPageObjectCypress,
  testUsers,
  waitForLogin
} from '@ygg/shared/user/test';
import { RelationRecord, TheThing } from '@ygg/the-thing/core';
import {
  MyThingsDataTablePageObjectCypress,
  TheThingDataTablePageObjectCypress,
  TheThingPageObjectCypress
} from '@ygg/the-thing/test';
import { find, isEmpty } from 'lodash';
import { beforeAll } from '../../support/before-all';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import {
  ScheduledEvents,
  TourPlanScheduled3Events,
  TourPlanScheduledOneEvent
} from '../schedule/sample-schedules';

const mailSlurpConfig = getEnv('mailslurp');
const mailSlurpInbox = mailSlurpConfig.inboxes[0];

describe('Approve scheduled events of tour-plan directly by admin', () => {
  const siteNavigator = new SiteNavigator();
  const accountWidgetPO = new AccountWidgetPageObjectCypress();
  const myNotificationsPO = new MyNotificationListPageObjectCypress();
  const tourPlanPO = new TourPlanPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress(
    '',
    ImitationTourPlan
  );
  const eventPO = new TheThingPageObjectCypress('', ImitationEvent);
  const myCalendarPO = new MyCalendarPageObjectCypress();
  const emceePO = new EmceePageObjectCypress();
  const commentsPO = new CommentListPageObjectCypress();
  const tourPlanAdminPO = new TourPlanAdminPageObjectCypress();

  ScheduledEvents.forEach(ev =>
    ImitationEvent.setState(ev, ImitationEvent.states.new)
  );

  const SampleTourPlans = [TourPlanScheduled3Events];
  const testEvents = ScheduledEvents.filter(ev =>
    TourPlanScheduled3Events.hasRelationTo(
      RelationshipScheduleEvent.name,
      ev.id
    )
  );
  const SampleThings = SamplePlays.concat(SampleEquipments)
    .concat(ScheduledEvents)
    .concat(SampleTourPlans);

  const adminUser: User = testUsers[0];
  const organizer: User = testUsers[1];
  const host: User = testUsers[3];

  for (let index = 0; index < ScheduledEvents.length; index++) {
    const tEvent = ScheduledEvents[index];
    const play = find(SamplePlays, _play =>
      tEvent.hasRelationTo(RelationshipEventService.role, _play.id)
    );
    play.ownerId = host.id;
    tEvent.setUserOfRole(RelationshipHost.role, host.id);
    tEvent.setUserOfRole(RelationshipOrganizer.role, organizer.id);
  }

  for (const tourPlan of SampleTourPlans) {
    tourPlan.setState(
      ImitationTourPlan.stateName,
      ImitationTourPlan.states['waitApproval']
    );
    tourPlan.ownerId = organizer.id;
    tourPlan.setUserOfRole(RelationshipOrganizer.role, organizer.id);
  }

  before(() => {
    beforeAll();
    // Only tour-plans of state applied can make schedule
    // Only Admin user can make schedule
    theMockDatabase.setAdmins([adminUser.id]);
    cy.wrap(SampleThings).each((thing: any) => {
      // thing.name += `_${Date.now()}`;
      theMockDatabase.insert(`${thing.collection}/${thing.id}`, thing);
    });
    cy.visit('/');
    loginTestUser(organizer);
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Assert test tour-plan and events forged corretly', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(
      TourPlanScheduled3Events
    );
    tourPlanPO.expectVisible();
    tourPlanPO.expectValue(TourPlanScheduled3Events);
    tourPlanPO.expectEvents(testEvents);
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states['waitApproval']);
  });

  it('Can not approve if not admin', () => {
    tourPlanPO.theThingPO.expectNoActionButton(
      ImitationTourPlan.actions['approve-available']
    );
  });

  it('Approve the tour-plan immediately by amdin', () => {
    logout();
    loginTestUser(adminUser);
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(ImitationTourPlan.states.waitApproval.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.waitApproval.name
    ].expectTheThing(TourPlanScheduled3Events);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.waitApproval.name
    ].gotoTheThingView(TourPlanScheduled3Events);
    tourPlanPO.theThingPO.expectActionButton(
      ImitationTourPlan.actions['approve-available']
    );
    tourPlanPO.theThingPO.runAction(
      ImitationTourPlan.actions['approve-available']
    );
    emceePO.confirm(
      `請確定遊程 ${TourPlanScheduled3Events.name} 中各行程的負責人已確認該負責行程可成行，強制標記遊程 ${TourPlanScheduled3Events.name} 為可成行並等待付款？`
    );
    emceePO.alert(
      `遊程 ${TourPlanScheduled3Events.name} 已標記為可成行。請通知客戶付款。`,
      { timeout: 20000 }
    );
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states['approved']);
  });

  it('Log action approve-available to a new comment', () => {
    const commentLog = new Comment({
      subjectId: TourPlanScheduledOneEvent.id,
      ownerId: adminUser.id,
      content: new Html(
        `📌 ${adminUser.name} 更改狀態 ${ImitationTourPlan.states['waitApproval'].label} ➡ ${ImitationTourPlan.states['approved'].label}`
      )
    });
    commentsPO.expectLatestComment(commentLog);
  });

  it('Organizer should receive notification of tour-plan approval', () => {
    const ntf: Notification = new Notification({
      type: 'tour-plan-approved',
      inviterId: adminUser.id,
      inviteeId: adminUser.id,
      email: adminUser.email,
      mailSubject: `您的遊程：${TourPlanScheduled3Events.name} 已確認可成行`,
      mailContent: `您的遊程：${TourPlanScheduled3Events.name} 已確認可成行，可以開始付款流程。`,
      landingUrl: `${ImitationTourPlan.routePath}/${TourPlanScheduled3Events.id}`,
      confirmMessage: `您的遊程：${TourPlanScheduled3Events.name} 已確認可成行，前往遊程檢視頁面。`,
      data: {}
    });

    logout();
    loginTestUser(organizer);
    accountWidgetPO.expectNotification();
    accountWidgetPO.clickNotification();
    myNotificationsPO.expectVisible();
    myNotificationsPO.clickNotification(ntf);
    emceePO.confirm(ntf.confirmMessage);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.expectName(TourPlanScheduled3Events.name);
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states['approved']);
  });
});
