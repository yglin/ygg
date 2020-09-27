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
import { logout, theMockDatabase } from '@ygg/shared/test/cypress';
import { Comment } from '@ygg/shared/thread/core';
import { CommentListPageObjectCypress } from '@ygg/shared/thread/test';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { Notification, User } from '@ygg/shared/user/core';
import {
  AccountWidgetPageObjectCypress,
  loginTestUser,
  MyNotificationListPageObjectCypress,
  testUsers
} from '@ygg/shared/user/test';
import {
  MyThingsDataTablePageObjectCypress,
  TheThingDataTablePageObjectCypress,
  TheThingPageObjectCypress
} from '@ygg/the-thing/test';
import { find } from 'lodash';
import { beforeAll } from '../../support/before-all';
import { hostApproveEvent } from '../event/event-testbot';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import {
  ScheduledEvents,
  TourPlanScheduled3Events,
  TourPlanScheduledOneEvent
} from '../schedule/sample-schedules';

const siteConfig = getEnv('siteConfig');
const mailSlurpConfig = getEnv('mailslurp');
const mailSlurpInbox = mailSlurpConfig.inboxes[0];

describe('Approve scheduled events of tour-plan by event-hosts', () => {
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
  const hosts: User[] = [];

  for (let index = 0; index < ScheduledEvents.length; index++) {
    const tEvent = ScheduledEvents[index];
    const host = testUsers[index + 1];
    hosts.push(host);
    const play = find(SamplePlays, _play =>
      tEvent.hasRelationTo(RelationshipEventService.role, _play.id)
    );
    play.ownerId = host.id;
    tEvent.setUserOfRole(RelationshipHost.role, host.id);
    tEvent.setUserOfRole(RelationshipOrganizer.role, adminUser.id);
  }

  for (const tourPlan of SampleTourPlans) {
    tourPlan.setState(
      ImitationTourPlan.stateName,
      ImitationTourPlan.states['applied']
    );
    tourPlan.ownerId = adminUser.id;
    tourPlan.setUserOfRole(RelationshipOrganizer.role, adminUser.id);
  }

  const [firstHost, ...restHosts] = hosts;
  const [firstEvent, ...restEvents] = testEvents;

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
    loginTestUser(adminUser);
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Assert test tour-plan and events forged corretly', () => {
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.applied.name
    ].expectTheThing(TourPlanScheduled3Events);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.applied.name
    ].gotoTheThingView(TourPlanScheduled3Events);
    tourPlanPO.expectVisible();
    tourPlanPO.expectValue(TourPlanScheduled3Events);
    tourPlanPO.expectEvents(testEvents);
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states['applied']);
  });

  it('Send approval request for tour-plan', () => {
    tourPlanPO.theThingPO.runAction(
      ImitationTourPlan.actions['send-approval-requests']
    );
    emceePO.confirm(
      `將送出各行程時段資訊給各行程負責人，並等待負責人確認。等待期間無法修改行程表，請確認各行程時段已安排妥善，確定送出？`
    );
    emceePO.alert(`已送出行程確認，等待各活動負責人確認中`, { timeout: 20000 });
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states['waitApproval']);
  });

  it('Log action send-approval-requests to a new comment', () => {
    const commentLog = new Comment({
      subjectId: TourPlanScheduledOneEvent.id,
      ownerId: adminUser.id,
      content: new Html(
        `📌 ${adminUser.name} 更改狀態 ${ImitationTourPlan.states.applied.label} ➡ ${ImitationTourPlan.states.waitApproval.label}`
      )
    });
    commentsPO.expectLatestComment(commentLog);
  });

  it('Send notification to event host(owner of play)', () => {
    const ntf = new Notification({
      type: NotificationHostEvent.type,
      inviterId: adminUser.id,
      email: firstHost.email,
      mailSubject: `您有一項${firstEvent.name}的行程活動邀請`,
      mailContent: `<pre>您有一項行程活動邀請，以行程<b>${firstEvent.name}</b>的負責人身分參加</pre>`,
      confirmMessage: `<h3>確認以負責人身份參加行程${firstEvent.name}？</h3><div>請於行程活動頁面按下確認參加按鈕</div>`,
      landingUrl: `/${ImitationEvent.routePath}/${firstEvent.id}`,
      data: {}
    });
    logout();
    loginTestUser(firstHost);
    accountWidgetPO.expectNotification();
    accountWidgetPO.clickNotification();
    myNotificationsPO.expectVisible();
    myNotificationsPO.clickNotification(ntf);
    emceePO.confirm(
      `確認以負責人身份參加行程${firstEvent.name}？請於行程活動頁面按下確認參加按鈕`
    );
    eventPO.expectVisible();
    eventPO.expectValue(firstEvent);
    eventPO.expectState(ImitationEvent.states['wait-approval']);
    eventPO.runAction(ImitationEvent.actions['host-approve']);
    emceePO.confirm(`確定會以負責人身份出席參加行程${firstEvent.name}？`);
    emceePO.alert(`已確認參加，之後若要取消請聯絡主辦者${adminUser.name}`);
    myCalendarPO.expectVisible();
  });

  it('Tour-plan not approved as only first event approved', () => {
    logout();
    loginTestUser(adminUser);
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(
      TourPlanScheduled3Events
    );
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states['waitApproval']);
  });

  it('Approve rest events by their hosts', () => {
    for (let index = 0; index < restEvents.length; index++) {
      const event = restEvents[index];
      const host = restHosts[index];

      logout();
      hostApproveEvent(host, adminUser, event);
    }
  });

  it('Tourplan approved as all events approved', () => {
    logout();
    loginTestUser(adminUser);
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(
      TourPlanScheduled3Events
    );
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.expectName(TourPlanScheduled3Events.name);
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states['approved']);
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
