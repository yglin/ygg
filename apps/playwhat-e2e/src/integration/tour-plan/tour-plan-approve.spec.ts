import {
  ImitationEvent,
  ImitationTourPlan,
  RelationshipHost,
  RelationshipOrganizer,
  RelationshipScheduleEvent
} from '@ygg/playwhat/core';
import { SiteNavigator, TourPlanPageObjectCypress } from '@ygg/playwhat/test';
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
  const emceePO = new EmceePageObjectCypress();
  const plays: TheThing[] = TourPlanScheduled3Events.getRelations(
    RelationPurchase.name
  )
    .map(r => find(SamplePlays, p => p.id === r.objectId))
    .filter(p => !!p);
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
          theMockDatabase.update(`users/${user.id}`, {
            email: inbox.emailAddress
          });
        });
      });

      // // Create a trivial schedule and save tour-plan
      // siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
      // myTourPlansPO.theThingDataTablePO.gotoTheThingView(
      //   TourPlanScheduled3Events
      // );
      // tourPlanPO.expectVisible();
      // tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.applied);
      // tourPlanPO.theThingPO.runAction(ImitationTourPlan.actions['schedule']);
      // schedulePO.expectVisible();
      // schedulePO.submit();
      // tourPlanPO.expectVisible();
    });
  });

  after(() => {
    // // Goto my-things page and delete previously created things
    // const myThingsPO = new MyThingsPageObjectCypress();
    // siteNavigator.goto(['the-things', 'my'], myThingsPO);
    // cy.wait(3000);
    // myThingsPO.deleteAll();
    theMockDatabase.clear();
  });

  it('Send approval request of each scheduled event to owner of the play', () => {
    const testEvent: TheThing = find(ScheduledEvents, ev =>
      TourPlanScheduledOneEvent.hasRelationTo(
        RelationshipScheduleEvent.name,
        ev.id
      )
    );
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
    // cy.waitEmail({
    //   subject: `您有一項${testEvent.name}的行程活動邀請`
    // }).then(email => {
    //   // console.log(response.body);
    //   cy.visit(email.html.links[0].href);
    //   waitForLogin();
    //   emceePO.confirm(
    //     `確認以負責人身份參加行程${testEvent.name}？請於行程活動頁面按下確認參加按鈕`
    //   );
    //   eventPO.expectVisible();
    //   eventPO.expectState(ImitationEvent.states['wait-approval']);
    // });
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
          [ImitationEvent.routePath, 'host'],
          myHostEventsDataTablePO
        );
        myHostEventsDataTablePO.gotoTheThingView(event);
        eventPO.expectVisible();
        eventPO.runAction(ImitationEvent.actions['host-approve']);
        emceePO.confirm(`確定會以負責人身份出席參加行程${event.name}？`);
        emceePO.alert(`已確認參加，之後若要取消請聯絡主辦者${me.name}`);
      })
      .then(() => {
        siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
        myTourPlansPO.theThingDataTablePO.gotoTheThingView(
          TourPlanScheduled3Events
        );
        tourPlanPO.expectVisible();
        tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.approved);
      });
  });
});
