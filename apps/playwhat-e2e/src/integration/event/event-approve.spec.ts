import {
  ImitationEvent,
  ImitationEventCellDefines,
  ImitationTourPlan,
  RelationshipHost,
  RelationshipOrganizer,
  RelationshipScheduleEvent
} from '@ygg/playwhat/core';
import {
  MyCalendarPageObjectCypress,
  SiteNavigator,
  TourPlanPageObjectCypress
} from '@ygg/playwhat/test';
import { TimeRange } from '@ygg/shared/omni-types/core';
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

describe('Approve scheduled events by host', () => {
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
  ImitationEvent.setState(testEvent, ImitationEvent.states['wait-approval']);
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
      siteNavigator.goto(
        [ImitationEvent.routePath, 'my'],
        myHostEventsDataTablePO
      );
      myHostEventsDataTablePO.gotoTheThingView(testEvent);
      eventPO.expectVisible();
    });
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Approve event as host and redirect to calendar', () => {
    const testEventTimeRange: TimeRange = testEvent.getCellValue(
      ImitationEventCellDefines.timeRange.name
    );
    eventPO.runAction(ImitationEvent.actions['host-approve']);
    emceePO.confirm(`確定會以負責人身份出席參加行程${testEvent.name}？`);
    emceePO.alert(`已確認參加，之後若要取消請聯絡主辦者${me.name}`);
    myCalendarPO.expectVisible();
    // myCalendarPO.expectMonth(testEventTimeRange.start);
    myCalendarPO.expectEvent(testEvent);
  });

  it('Click on event in calendar redirect to view page', () => {
    myCalendarPO.clickEvent(testEvent);
    eventPO.expectVisible();
    eventPO.expectValue(testEvent);
    eventPO.expectState(ImitationEvent.states['host-approved']);    
  });
  
  // it('Show button event to google calendar', () => {
  //   cy.pause();
  //   eventPO.runAction(ImitationEvent.actions['add-google-calendar']);
  //   emceePO.confirm(`將行程${testEvent.name}加到我的Google日曆？`);
  //   emceePO.alert(`行程${testEvent.name}已加到你的Google日曆中`);
  // });
  
});
