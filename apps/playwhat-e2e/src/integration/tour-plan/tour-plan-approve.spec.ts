import {
  ImitationEvent,
  ImitationTourPlan,
  RelationshipHost,
  RelationshipOrganizer,
  RelationshipScheduleEvent,
  ImitationEventCellDefines
} from '@ygg/playwhat/core';
import {
  SiteNavigator,
  TourPlanPageObjectCypress,
  MyCalendarPageObjectCypress,
  MyEventsPageObjectCypress
} from '@ygg/playwhat/test';
import { SchedulePageObjectCypress } from '@ygg/schedule/test';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
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
import { find } from 'lodash';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import {
  RelationPlayOfEvents,
  ScheduledEvents,
  TourPlanScheduled3Events,
  TourPlanScheduledOneEvent
} from '../schedule/sample-schedules';
import { TimeRange } from '@ygg/shared/omni-types/core';

describe('Approve scheduled events of tour-plan', () => {
  const siteNavigator = new SiteNavigator();
  ScheduledEvents.forEach(ev =>
    ImitationEvent.setState(ev, ImitationEvent.states.new)
  );
  const SampleThings = SamplePlays.concat(SampleEquipments)
    .concat(ScheduledEvents)
    .concat([TourPlanScheduledOneEvent, TourPlanScheduled3Events]);
  const tourPlanPO = new TourPlanPageObjectCypress();
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
      waitForLogin().then(() => {
        // @ts-ignore
        cy.createInbox().then(inbox => {
          cy.wrap(inbox).as('mailslurpInbox');
          theMockDatabase.update(`${User.collection}/${user.id}`, {
            email: inbox.emailAddress
          });
        });
      });
    });
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Send approval request of each scheduled event to owner of the play', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(
      TourPlanScheduledOneEvent
    );
    tourPlanPO.expectVisible();
    tourPlanPO.sendApprovalRequests();
    cy.wait(10000);
    // @ts-ignore
    cy.get('@mailslurpInbox').then(inbox => {
      // @ts-ignore
      cy.waitForLatestEmail(inbox.id).then(email => {
        expect(email.subject).to.have.string(
          `您有一項${testEvent.name}的行程活動邀請`
        );
        // Extract link
        const link = /href="(http.*)"/.exec(email.body)[1];
        cy.visit(link);
        waitForLogin();
        emceePO.confirm(
          `確認以負責人身份參加行程${testEvent.name}？請於行程活動頁面按下確認參加按鈕`
        );
        eventPO.expectVisible();
        eventPO.expectState(ImitationEvent.states['wait-approval']);
      });
    });
  });

  it('Approve event as host and redirect to calendar', () => {
    const testEventTimeRange: TimeRange = testEvent.getCellValue(
      ImitationEventCellDefines.timeRange.name
    );

    // // ==== XXX Remove this block if following previous test =====
    // ImitationEvent.setState(testEvent, ImitationEvent.states['wait-approval']);
    // theMockDatabase.insert(
    //   `${testEvent.collection}/${testEvent.id}`,
    //   testEvent
    // );
    // siteNavigator.goto(
    //   [ImitationEvent.routePath, 'host'],
    //   myHostEventsDataTablePO
    // );
    // myHostEventsDataTablePO.gotoTheThingView(testEvent);
    // eventPO.expectVisible();
    // // ==== XXX Remove this block if following previous test =====

    eventPO.runAction(ImitationEvent.actions['host-approve']);
    emceePO.confirm(`確定會以負責人身份出席參加行程${testEvent.name}？`);
    emceePO.alert(`已確認參加，之後若要取消請聯絡主辦者${me.name}`);
    myCalendarPO.expectVisible();
    // myCalendarPO.expectMonth(testEventTimeRange.start);
    myCalendarPO.expectEvent(testEvent);
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
        myCalendarPO.expectEvent(event);            
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
});
