import {
  ImitationEvent,
  RelationshipHost,
  RelationshipOrganizer,
  RelationshipScheduleEvent
} from '@ygg/playwhat/core';
import { MyCalendarPageObjectCypress, SiteNavigator } from '@ygg/playwhat/test';
import { theMockDatabase } from '@ygg/shared/test/cypress';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import { loginTestUser, testUsers } from '@ygg/shared/user/test';
import { TheThing } from '@ygg/the-thing/core';
import {
  TheThingDataTablePageObjectCypress,
  TheThingPageObjectCypress
} from '@ygg/the-thing/test';
import { find } from 'lodash';
import { beforeAll } from '../../support/before-all';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import {
  ScheduledEvents,
  TourPlanScheduled3Events,
  TourPlanScheduledOneEvent
} from '../schedule/sample-schedules';
import { hostApproveEvent } from './event-testbot';

describe('Approve scheduled events by host', () => {
  const siteNavigator = new SiteNavigator();
  const eventPO = new TheThingPageObjectCypress('', ImitationEvent);
  const myCalendarPO = new MyCalendarPageObjectCypress();
  const emceePO = new EmceePageObjectCypress();
  const myHostEventsDataTablePO = new TheThingDataTablePageObjectCypress(
    '',
    ImitationEvent
  );

  ScheduledEvents.forEach(ev =>
    ImitationEvent.setState(ev, ImitationEvent.states.new)
  );
  const SampleThings = SamplePlays.concat(SampleEquipments)
    .concat(ScheduledEvents)
    .concat([TourPlanScheduledOneEvent, TourPlanScheduled3Events]);

  const testEvent: TheThing = find(ScheduledEvents, ev =>
    TourPlanScheduledOneEvent.hasRelationTo(
      RelationshipScheduleEvent.name,
      ev.id
    )
  );
  ImitationEvent.setState(testEvent, ImitationEvent.states['wait-approval']);
  const eventHost: User = testUsers[0];
  const eventOrganizer: User = testUsers[1];

  before(() => {
    beforeAll();
    // Only Admin user can make schedule
    theMockDatabase.setAdmins([eventHost.id]);
    cy.wrap(SampleThings).each((thing: any) => {
      // thing.name += `_${Date.now()}`;
      thing.ownerId = eventHost.id;
      theMockDatabase.insert(`${thing.collection}/${thing.id}`, thing);
    });

    ScheduledEvents.forEach(event => {
      event.setUserOfRole(RelationshipHost.role, eventHost.id);
      event.setUserOfRole(RelationshipOrganizer.role, eventOrganizer.id);
    });

    cy.visit('/');
    // loginTestUser(eventHost);
    // siteNavigator.goto(
    //   [ImitationEvent.routePath, 'my'],
    //   myHostEventsDataTablePO
    // );
    // myHostEventsDataTablePO.gotoTheThingView(testEvent);
    // eventPO.expectVisible();
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Approve event as host and redirect to calendar', () => {
    hostApproveEvent(eventHost, eventOrganizer, testEvent);
    // eventPO.runAction(ImitationEvent.actions['host-approve']);
    // emceePO.confirm(`確定會以負責人身份出席參加行程${testEvent.name}？`);
    // emceePO.alert(`已確認參加，之後若要取消請聯絡主辦者${eventOrganizer.name}`);
    // myCalendarPO.expectVisible();
    // // myCalendarPO.expectMonth(testEventTimeRange.start);
    // myCalendarPO.expectEvent(testEvent);
  });

  it('Click on event in calendar redirect to view page', () => {
    myCalendarPO.clickEvent(testEvent);
    eventPO.expectVisible();
    eventPO.expectValue(testEvent);
    eventPO.expectState(ImitationEvent.states['host-approved']);
  });

  // it('Show button of adding event to google calendar', () => {
  //   // cy.pause();
  //   eventPO.runAction(ImitationEvent.actions['add-google-calendar']);
  //   emceePO.confirm(`將行程${testEvent.name}加到我的Google日曆？`);
  //   emceePO.alert(`行程${testEvent.name}已加到你的Google日曆中`);
  // });
});
