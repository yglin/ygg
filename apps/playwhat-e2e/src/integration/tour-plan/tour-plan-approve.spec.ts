import {
  ImitationEvent,
  ImitationTourPlan,
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
import { waitForLogin } from '@ygg/shared/user/test';
import { RelationPurchase } from '@ygg/shopping/core';
import { RelationRecord, TheThing } from '@ygg/the-thing/core';
import {
  MyThingsDataTablePageObjectCypress,
  TheThingDataTablePageObjectCypress,
  TheThingPageObjectCypress
} from '@ygg/the-thing/test';
import { find, isEmpty } from 'lodash';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import {
  RelationPlayOfEvents,
  ScheduledEvents,
  TourPlanScheduled3Events,
  TourPlanScheduledOneEvent
} from '../schedule/sample-schedules';
import * as env from '@ygg/env/environments.json';
import { TourPlanWithPlaysNoEquipment } from './sample-tour-plan';
const mailSlurpInbox = env.mailslurp.inboxes[0];

describe('Approve scheduled events of tour-plan', () => {
  const siteNavigator = new SiteNavigator();
  ScheduledEvents.forEach(ev =>
    ImitationEvent.setState(ev, ImitationEvent.states.new)
  );
  const SampleThings = SamplePlays.concat(SampleEquipments)
    .concat(ScheduledEvents)
    .concat([TourPlanScheduledOneEvent, TourPlanScheduled3Events]);
  const tourPlanPO = new TourPlanPageObjectCypress();
  const tourPlanAdminPO = new TourPlanAdminPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress(
    '',
    ImitationTourPlan
  );
  const myHostEventsDataTablePO = new TheThingDataTablePageObjectCypress(
    '',
    ImitationEvent
  );
  const eventPO = new TheThingPageObjectCypress('', ImitationEvent);
  const myCalendarPO = new MyCalendarPageObjectCypress();
  const emceePO = new EmceePageObjectCypress();
  const commentsPO = new CommentListPageObjectCypress();
  const plays: TheThing[] = TourPlanScheduled3Events.getRelations(
    RelationPurchase.name
  )
    .map(r => find(SamplePlays, p => p.id === r.objectId))
    .filter(p => !!p);
  const testEvent: TheThing = find(ScheduledEvents, ev =>
    TourPlanScheduledOneEvent.hasRelationTo(
      RelationshipScheduleEvent.name,
      ev.id
    )
  );
  let me: User;

  before(() => {
    // Only tour-plans of state applied can make schedule
    login().then(user => {
      me = user;
      // Only Admin user can make schedule
      theMockDatabase.setAdmins([user.id]);
      cy.wrap(SampleThings).each((thing: any) => {
        // thing.name += `_${Date.now()}`;
        thing.ownerId = user.id;
        theMockDatabase.insert(`${thing.collection}/${thing.id}`, thing);
      });

      const relationEventHosts: RelationRecord[] = ScheduledEvents.map(
        ev =>
          new RelationRecord({
            subjectCollection: ImitationEvent.collection,
            subjectId: ev.id,
            objectCollection: User.collection,
            objectId: user.id,
            objectRole: RelationshipHost.name
          })
      );
      const relationEventOrganizers: RelationRecord[] = ScheduledEvents.map(
        ev =>
          new RelationRecord({
            subjectCollection: ImitationEvent.collection,
            subjectId: ev.id,
            objectCollection: User.collection,
            objectId: user.id,
            objectRole: RelationshipOrganizer.name
          })
      );
      cy.wrap(
        RelationPlayOfEvents.concat(relationEventHosts).concat(
          relationEventOrganizers
        )
      ).each((relation: RelationRecord) => {
        theMockDatabase.insert(
          `${RelationRecord.collection}/${relation.id}`,
          relation
        );
      });

      cy.visit('/');
      waitForLogin();
      waitForLogin().then(() => {
        theMockDatabase.update(`${User.collection}/${user.id}`, {
          email: mailSlurpInbox.email
        });
      });
    });
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Send approval request for tour-plan', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(
      TourPlanScheduledOneEvent
    );
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.runAction(
      ImitationTourPlan.actions['send-approval-requests']
    );
    emceePO.confirm(
      `將送出行程中各活動時段資訊給各活動負責人，並等待負責人確認。等待期間無法修改行程表，請確認行程中各活動時段已安排妥善，確定送出？`
    );
    emceePO.alert(`已送出行程確認，等待各活動負責人確認中`, { timeout: 20000 });
  });

  it('Log action send-approval-requests to a new comment', () => {
    getCurrentUser().then(user => {
      const commentLog = new Comment({
        subjectId: TourPlanScheduledOneEvent.id,
        ownerId: user.id,
        content: new Html(
          `📌 ${user.name} 更改狀態 ${ImitationTourPlan.states.applied.label} ➡ ${ImitationTourPlan.states.waitApproval.label}`
        )
      });
      commentsPO.expectLatestComment(commentLog);
    });
  });

  it('Send approval request of each scheduled event to owner of the play', () => {
    // cy.wait(10000);
    // @ts-ignore
    // cy.waitForLatestEmail(mailSlurpInbox.id).then(email => {
    cy.waitForMatchingEmail(mailSlurpInbox.id, testEvent.name).then(email => {
      expect(email.subject).to.have.string(
        `您有一項${testEvent.name}的行程活動邀請`
      );
      // console.log(email);
      // Extract link
      const links = /href="(http.*)"/.exec(email.body);
      if (isEmpty(links) || links.length < 2) {
        throw new Error(`Not found links in email body:\n${email.body}`);
      }
      const link = links[1];
      cy.visit(link);
      waitForLogin();
      emceePO.confirm(
        `確認以負責人身份參加行程${testEvent.name}？請於行程活動頁面按下確認參加按鈕`
      );
      eventPO.expectVisible();
      eventPO.expectState(ImitationEvent.states['wait-approval']);
    });
  });

  it('Admin user can directly approve tour-plan', () => {
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    tourPlanAdminPO.switchToTab(ImitationTourPlan.states.waitApproval.name);
    tourPlanAdminPO.theThingDataTables[
      ImitationTourPlan.states.waitApproval.name
    ].gotoTheThingView(TourPlanScheduledOneEvent);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.runAction(
      ImitationTourPlan.actions['approve-available']
    );
    emceePO.confirm(
      `請確定遊程 ${TourPlanScheduledOneEvent.name} 中各行程的負責人已確認該負責行程可成行，將標記遊程 ${TourPlanScheduledOneEvent.name} 為可成行並等待付款？`
    );
    emceePO.alert(
      `遊程 ${TourPlanScheduledOneEvent.name} 已標記為可成行。請通知客戶付款。`
    );
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.approved);
  });

  it('Log action approve-available to a new comment', () => {
    getCurrentUser().then(user => {
      const commentLog = new Comment({
        subjectId: TourPlanScheduledOneEvent.id,
        ownerId: user.id,
        content: new Html(
          `📌 ${user.name} 更改狀態 ${ImitationTourPlan.states.waitApproval.label} ➡ ${ImitationTourPlan.states.approved.label}`
        )
      });
      commentsPO.expectLatestComment(commentLog);
    });
  });

  it('Tour-plan approved when all its event approved', () => {
    const testEvents = ScheduledEvents.filter(ev =>
      TourPlanScheduled3Events.hasRelationTo(
        RelationshipScheduleEvent.name,
        ev.id
      )
    );

    ImitationTourPlan.setState(
      TourPlanScheduled3Events,
      ImitationTourPlan.states.waitApproval
    );
    theMockDatabase.insert(
      `${TourPlanScheduled3Events.collection}/${TourPlanScheduled3Events.id}`,
      TourPlanScheduled3Events
    );

    cy.wrap(testEvents).each((ev: TheThing) => {
      ImitationEvent.setState(ev, ImitationEvent.states['wait-approval']);
      theMockDatabase.insert(`${ev.collection}/${ev.id}`, ev);
      const relationTourPlanEvent: RelationRecord = new RelationRecord({
        subjectCollection: ImitationTourPlan.collection,
        subjectId: TourPlanScheduled3Events.id,
        objectCollection: ImitationEvent.collection,
        objectId: ev.id,
        objectRole: RelationshipScheduleEvent.name
      });
      theMockDatabase.insert(
        `${RelationRecord.collection}/${relationTourPlanEvent.id}`,
        relationTourPlanEvent
      );
    });

    // start test
    cy.wrap(testEvents)
      .each((event: TheThing) => {
        siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
        myTourPlansPO.theThingDataTablePO.gotoTheThingView(
          TourPlanScheduled3Events
        );
        tourPlanPO.expectVisible();
        tourPlanPO.theThingPO.expectState(
          ImitationTourPlan.states.waitApproval
        );
        siteNavigator.goto(
          [ImitationEvent.routePath, 'my'],
          myHostEventsDataTablePO
        );
        myHostEventsDataTablePO.gotoTheThingView(event);
        eventPO.expectVisible();
        eventPO.runAction(ImitationEvent.actions['host-approve']);
        emceePO.confirm(`確定會以負責人身份出席參加行程${event.name}？`);
        emceePO.alert(`已確認參加，之後若要取消請聯絡主辦者${me.name}`);
        myCalendarPO.expectVisible();
      })
      .then(() => {
        // cy.pause();
        siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
        myTourPlansPO.theThingDataTablePO.gotoTheThingView(
          TourPlanScheduled3Events
        );
        tourPlanPO.expectVisible();
        tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.approved);
      });
  });

  it('Receive email notification of tour-plan approval', () => {
    // @ts-ignore
    cy.waitForMatchingEmail(
      mailSlurpInbox.id,
      TourPlanScheduled3Events.name
    ).then(email => {
      expect(email.subject).to.have.string(
        `您的遊程：${TourPlanScheduled3Events.name} 已確認可成行`
      );
      // console.log(email);
      // Extract link
      expect(email.body).to.have.string(
        `您的遊程：${TourPlanScheduled3Events.name} 已確認可成行，可以開始付款流程。`
      );
      const links = /href="(http.*)"/.exec(email.body);
      if (isEmpty(links) || links.length < 2) {
        throw new Error(`Not found links in email body:\n${email.body}`);
      }
      const link = links[1];
      cy.visit(link);
      waitForLogin();
      emceePO.confirm(
        `您的遊程：${TourPlanScheduled3Events.name} 已確認可成行，前往遊程檢視頁面。`
      );
      tourPlanPO.expectVisible();
      tourPlanPO.theThingPO.expectName(TourPlanScheduled3Events.name);
      tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.approved);
    });
  });
});
