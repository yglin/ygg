import {
  CellDefinesTourPlan,
  ImitationTourPlan,
  ScheduleAdapter,
  ImitationTourPlanCellDefines,
  RelationshipPlay,
  ImitationPlayCellDefines,
  RelationNamePlay,
  ImitationEvent,
  ImitationPlay,
  ImitationEventCellDefines
} from '@ygg/playwhat/core';
import { SiteNavigator, TourPlanPageObjectCypress } from '@ygg/playwhat/test';
import { SchedulePageObjectCypress } from '@ygg/schedule/test';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import { waitForLogin } from '@ygg/shared/user/test';
import {
  TheThing,
  TheThingRelation,
  RelationRecord
} from '@ygg/the-thing/core';
import { MyThingsDataTablePageObjectCypress } from '@ygg/the-thing/test';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import { ScheduleTrivial, TourPlanUnscheduled } from './sample-schedules';
import {
  DateRange,
  DayTimeRange,
  DayTime,
  TimeRange,
  BusinessHours,
  OpenHour,
  WeekDay
} from '@ygg/shared/omni-types/core';
import * as moment from 'moment';
import { RelationPurchase } from '@ygg/shopping/core';
import { ServiceAvailablility, ServiceEvent } from '@ygg/schedule/core';
import { random } from 'lodash';

function stubBusisnessHourForPlay(
  play: TheThing,
  businessHour: BusinessHours
): Cypress.Chainable<any> {
  play.setCellValue(ImitationPlayCellDefines.businessHours.name, businessHour);
  return theMockDatabase.insert(`${ImitationPlay.collection}/${play.id}`, play);
}

function generateApprovedEventsForPlay(
  play: TheThing,
  timeRange: TimeRange
): TheThing[] {
  const maxParticipants = play.getCellValue(
    ImitationPlayCellDefines.maxParticipants.name
  );
  const timeLength = play.getCellValue(
    ImitationPlayCellDefines.timeLength.name
  );
  const events: TheThing[] = [];
  const timeIterator = moment(timeRange.start);
  timeIterator.add(30 * random(1, 4), 'minute');
  while (timeIterator.isBefore(timeRange.end)) {
    const event: TheThing = ImitationEvent.createTheThing();
    event.setCellValue(
      ImitationEventCellDefines.numParticipants.name,
      random(1, maxParticipants)
    );
    event.setCellValue(
      ImitationEventCellDefines.timeRange.name,
      new TimeRange(
        timeIterator.toDate(),
        timeIterator.add(timeLength, 'minute').toDate()
      )
    );
    ImitationEvent.setState(event, ImitationEvent.states['host-approved']);
    events.push(event);
    timeIterator.add(30 * random(6, 20), 'minute');
  }
  return events;
}

function stubEvent(event: TheThing, play: TheThing) {
  const relation: RelationRecord = new RelationRecord({
    subjectCollection: ImitationEvent.collection,
    subjectId: event.id,
    objectCollection: ImitationPlay.collection,
    objectId: play.id,
    objectRole: RelationshipPlay.name
  });
  theMockDatabase.insert(`${ImitationEvent.collection}/${event.id}`, event);
  theMockDatabase.insert(
    `${RelationRecord.collection}/${relation.id}`,
    relation
  );
}

describe('Schedule edit', () => {
  const siteNavigator = new SiteNavigator();
  const SampleThings = SamplePlays.concat(SampleEquipments).concat([
    TourPlanUnscheduled
  ]);
  const tourPlanPO = new TourPlanPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress(
    '',
    ImitationTourPlan
  );
  const testPlays = SamplePlays.filter(play =>
    TourPlanUnscheduled.hasRelationTo(RelationPurchase.name, play.id)
  );
  ImitationTourPlan.setState(
    TourPlanUnscheduled,
    ImitationTourPlan.states.applied
  );
  // Setup test dateRange next whole week, dayTimeRange 9:00 - 17:00
  const nextMonday = moment()
    .add(1, 'week')
    .day('Monday');
  const dateRange = new DateRange(
    nextMonday.toDate(),
    nextMonday.add(6, 'day').toDate()
  );
  const dayTimeRange = new DayTimeRange(new DayTime(9, 0), new DayTime(17, 0));
  TourPlanUnscheduled.setCellValue(
    ImitationTourPlanCellDefines.dateRange.name,
    dateRange
  );
  TourPlanUnscheduled.setCellValue(
    ImitationTourPlanCellDefines.dayTimeRange.name,
    dayTimeRange
  );
  const schedulePO = new SchedulePageObjectCypress('', {
    dateRange,
    dayTimeRange
  });

  const testPlay1 = testPlays[0];
  const testBusinessHours01 = new BusinessHours();
  let dayTimeRangeTemp = new DayTimeRange(
    new DayTime(10, 0),
    new DayTime(15, 30)
  );
  testBusinessHours01.addOpenHour(
    new OpenHour(WeekDay.Monday, dayTimeRangeTemp)
  );
  testBusinessHours01.addOpenHour(
    new OpenHour(WeekDay.Tuesday, dayTimeRangeTemp)
  );
  testBusinessHours01.addOpenHour(
    new OpenHour(WeekDay.Wednesday, dayTimeRangeTemp)
  );
  testBusinessHours01.addOpenHour(
    new OpenHour(WeekDay.Thursday, dayTimeRangeTemp)
  );
  testBusinessHours01.addOpenHour(
    new OpenHour(WeekDay.Friday, dayTimeRangeTemp)
  );

  const testPlay2 = testPlays[1];
  const testBusinessHours02 = new BusinessHours();
  dayTimeRangeTemp = new DayTimeRange(new DayTime(12, 0), new DayTime(17, 30));
  testBusinessHours02.addOpenHour(
    new OpenHour(WeekDay.Saturday, dayTimeRangeTemp)
  );
  testBusinessHours02.addOpenHour(
    new OpenHour(WeekDay.Sunday, dayTimeRangeTemp)
  );

  const testPlay3 = testPlays[2];
  const approvedEvents: TheThing[] = generateApprovedEventsForPlay(
    testPlay3,
    dateRange.toTimeRange()
  );
  // console.log(approvedEvents);
  const availability: ServiceAvailablility = new ServiceAvailablility(
    testPlay3.id,
    {
      timeRange: dateRange.toTimeRange(),
      capacity: testPlay3.getCellValue(
        ImitationPlayCellDefines.maxParticipants.name
      )
    }
  );
  availability.mergeBusinessHours(testBusinessHours01);
  for (const event of approvedEvents) {
    availability.addOccupancy(
      event.getCellValue(ImitationEventCellDefines.timeRange.name),
      event.getCellValue(ImitationEventCellDefines.numParticipants.name)
    );
  }
  // console.log(availability.print());

  before(() => {
    // Only tour-plans of state applied can make schedule
    login().then(user => {
      // Only Admin user can make schedule
      theMockDatabase.setAdmins([user.id]);
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${thing.collection}/${thing.id}`, thing);
      });
      stubBusisnessHourForPlay(testPlay1, testBusinessHours01);
      stubBusisnessHourForPlay(testPlay2, testBusinessHours02);
      stubBusisnessHourForPlay(testPlay3, testBusinessHours01);
      cy.wrap(approvedEvents).each((event: TheThing) => {
        stubEvent(event, testPlay3);
      });
      cy.visit('/');
      waitForLogin();
      siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
      myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanUnscheduled);
      tourPlanPO.expectVisible();
      tourPlanPO.theThingPO.runAction(ImitationTourPlan.actions['schedule']);
      schedulePO.expectVisible();
      // Wait for loading service availabilities
      cy.wait(3000);
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

  it('Click on event shows its business-hours', () => {
    schedulePO.clickOnEvent(testPlay1.name);
    schedulePO.expectBusinessHours(
      testBusinessHours01,
      testPlay1.color,
      testPlay1.getCellValue(ImitationPlayCellDefines.maxParticipants.name)
    );
    schedulePO.clickOnEvent(testPlay2.name);
    schedulePO.expectBusinessHours(
      testBusinessHours02,
      testPlay2.color,
      testPlay2.getCellValue(ImitationPlayCellDefines.maxParticipants.name)
    );
  });

  it('Show available quantities on time-slot', () => {
    schedulePO.clickOnEvent(testPlay3.name);
    // cy.pause();
    schedulePO.expectAvailability(availability);
  });

  it('Drag a single event to target time-slot', () => {
    const targetStart: Date = moment(dateRange.start)
      .add(1, 'day')
      .add(13, 'hour')
      .toDate();
    const targetTimeRange: TimeRange = new TimeRange(
      targetStart,
      moment(targetStart)
        .add(
          testPlay1.getCellValue(ImitationPlayCellDefines.timeLength.name),
          'minute'
        )
        .toDate()
    );
    schedulePO.moveEvent(testPlay1.name, targetStart);
    schedulePO.expectEventInTimeSlot(testPlay1.name, targetStart);
    schedulePO.submit();
    tourPlanPO.expectVisible();
    tourPlanPO.expectEventTimeRange(testPlay1.name, targetTimeRange);
    // // XXX yglin 2020/07/15: use narrower date range to prevent the weird scrolling during drag-n-drop,
    // // Don't know why but it fucked up the coordinate of target droppable
    // const newDateRange = new DateRange(
    //   nextMonday.toDate(),
    //   nextMonday.add(2, 'day').toDate()
    // );
    // TourPlanUnscheduled.setCellValue(
    //   ImitationTourPlanCellDefines.dateRange.name,
    //   newDateRange
    // );
    // theMockDatabase
    //   .insert(
    //     `${TourPlanUnscheduled.collection}/${TourPlanUnscheduled.id}`,
    //     TourPlanUnscheduled
    //   )
    //   .then(() => {
    //     const play = testPlays[0];
    //     // move event to second day 13:00
    //     const targetStart: Date = moment(newDateRange.start)
    //       .add(1, 'day')
    //       .add(13, 'hour')
    //       .toDate();
    //     const targetTimeRange: TimeRange = new TimeRange(
    //       targetStart,
    //       moment(targetStart)
    //         .add(
    //           play.getCellValue(ImitationPlayCellDefines.timeLength.name),
    //           'minute'
    //         )
    //         .toDate()
    //     );
    //     siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    //     myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanUnscheduled);
    //     tourPlanPO.expectVisible();
    //     tourPlanPO.theThingPO.runAction(ImitationTourPlan.actions['schedule']);
    //     schedulePO.expectVisible();
    //     schedulePO.moveEvent(play.name, targetStart);
    //     schedulePO.expectEventInTimeSlot(play.name, targetStart);
    //     schedulePO.submit();
    //     tourPlanPO.expectVisible();
    //     tourPlanPO.expectEventTimeRange(play.name, targetTimeRange);
    //   });
  });
});
