import {
  ImitationEvent,
  ImitationEventCellDefines,
  ImitationPlay,
  ImitationPlayCellDefines,
  ImitationTourPlan,
  ImitationTourPlanCellDefines,
  RelationshipPlay
} from '@ygg/playwhat/core';
import { SiteNavigator, TourPlanPageObjectCypress } from '@ygg/playwhat/test';
import { SchedulePageObjectCypress } from '@ygg/schedule/test';
import {
  BusinessHours,
  DateRange,
  DayTime,
  DayTimeRange,
  OpenHour,
  TimeRange,
  WeekDay
} from '@ygg/shared/omni-types/core';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import { waitForLogin } from '@ygg/shared/user/test';
import { RelationPurchase, ShoppingCellDefines } from '@ygg/shopping/core';
import { RelationRecord, TheThing } from '@ygg/the-thing/core';
import { MyThingsDataTablePageObjectCypress } from '@ygg/the-thing/test';
import { random } from 'lodash';
import * as moment from 'moment';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import { TourPlanUnscheduled } from './sample-schedules';

function stubBusisnessHourForPlay(
  play: TheThing,
  businessHour: BusinessHours
): Cypress.Chainable<any> {
  play.setCellValue(ImitationPlayCellDefines.businessHours.id, businessHour);
  return theMockDatabase.insert(`${ImitationPlay.collection}/${play.id}`, play);
}

function forgeApprovedEventsForPlay(
  play: TheThing,
  timeRange: TimeRange
): TheThing[] {
  const maximum = play.getCellValue(ImitationPlayCellDefines.maximum.id);
  const timeLength = play.getCellValue(ImitationPlayCellDefines.timeLength.id);
  const events: TheThing[] = [];
  const timeIterator = moment(timeRange.start);
  timeIterator.add(30 * random(1, 4), 'minute');
  while (timeIterator.isBefore(timeRange.end)) {
    const event: TheThing = ImitationEvent.createTheThing();
    event.setCellValue(
      ImitationEventCellDefines.numParticipants.id,
      random(1, maximum)
    );
    event.setCellValue(
      ImitationEventCellDefines.timeRange.id,
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
  // if (event.getCellValue(ImitationEventCellDefines.location.id) === null) {
  //   console.log('幹??');
  //   console.log(event);
  // }
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
  const testPlay1 = testPlays[0];
  const testPlay2 = testPlays[1];
  const testPlay3 = testPlays[2];
  const numParticipants =
    testPlay3.getCellValue(ImitationPlayCellDefines.maximum.id) + 1;

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
    ImitationTourPlanCellDefines.dateRange.id,
    dateRange
  );
  TourPlanUnscheduled.setCellValue(
    ImitationTourPlanCellDefines.dayTimeRange.id,
    dayTimeRange
  );
  for (const relation of TourPlanUnscheduled.getRelations(
    RelationPurchase.name
  )) {
    relation.setCellValue(ShoppingCellDefines.quantity.id, numParticipants);
  }
  const schedulePO = new SchedulePageObjectCypress('', {
    dateRange,
    dayTimeRange
  });

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

  const testBusinessHours02 = new BusinessHours();
  dayTimeRangeTemp = new DayTimeRange(new DayTime(12, 0), new DayTime(17, 30));
  testBusinessHours02.addOpenHour(
    new OpenHour(WeekDay.Saturday, dayTimeRangeTemp)
  );
  testBusinessHours02.addOpenHour(
    new OpenHour(WeekDay.Sunday, dayTimeRangeTemp)
  );

  const testBusinessHours03 = testBusinessHours01;
  const approvedEvents: TheThing[] = [];
  const maximum = testPlay3.getCellValue(ImitationPlayCellDefines.maximum.id);
  const timeLength = testPlay3.getCellValue(
    ImitationPlayCellDefines.timeLength.id
  );
  const approvedEvent01 = ImitationEvent.createTheThing(testPlay3);
  approvedEvent01.setCellValue(
    ImitationEventCellDefines.numParticipants.id,
    random(1, maximum)
  );
  // 2nd day 10:00 -
  const tempMoment = moment(dateRange.start)
    .add(1, 'day')
    .hour(10)
    .minute(0);
  approvedEvent01.setCellValue(
    ImitationEventCellDefines.timeRange.id,
    new TimeRange(
      tempMoment.toDate(),
      tempMoment.add(timeLength, 'minute').toDate()
    )
  );
  ImitationEvent.setState(
    approvedEvent01,
    ImitationEvent.states['host-approved']
  );
  approvedEvents.push(approvedEvent01);
  const approvedEvent02 = ImitationEvent.createTheThing(testPlay3);
  approvedEvent02.setCellValue(
    ImitationEventCellDefines.numParticipants.id,
    random(1, maximum)
  );
  // 3rd day 12:30 -
  tempMoment
    .add(1, 'day')
    .hour(12)
    .minute(30);
  approvedEvent02.setCellValue(
    ImitationEventCellDefines.timeRange.id,
    new TimeRange(
      tempMoment.toDate(),
      tempMoment.add(timeLength, 'minute').toDate()
    )
  );
  ImitationEvent.setState(
    approvedEvent02,
    ImitationEvent.states['host-approved']
  );
  approvedEvents.push(approvedEvent02);

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
      stubBusisnessHourForPlay(testPlay3, testBusinessHours03);
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
      // cy.pause();
    });
  });

  after(() => {
    // // Goto my-things page and delete previously created things
    // const myThingsPO = new MyThingsPageObjectCypress();
    // siteNavigator.goto(['the-things', 'my'], myThingsPO);
    // cy.wait(3000);
    // myThingsPO.deleteAll();
    // theMockDatabase.clear();
  });

  it('Click on event shows its business-hours', () => {
    schedulePO.clickOnEvent(testPlay1.name);
    schedulePO.expectBusinessHours(
      testBusinessHours01,
      testPlay1.color,
      testPlay1.getCellValue(ImitationPlayCellDefines.maximum.id)
    );
    schedulePO.clickOnEvent(testPlay2.name);
    schedulePO.expectBusinessHours(
      testBusinessHours02,
      testPlay2.color,
      testPlay2.getCellValue(ImitationPlayCellDefines.maximum.id)
    );
  });

  it('Show available quantities on time-slot', () => {
    const max = testPlay3.getCellValue(ImitationPlayCellDefines.maximum.id);
    const timeRange01: TimeRange = approvedEvent01.getCellValue(
      ImitationEventCellDefines.timeRange.id
    );
    const availability01: number =
      max -
      approvedEvent01.getCellValue(
        ImitationEventCellDefines.numParticipants.id
      );
    const timeRange02: TimeRange = approvedEvent02.getCellValue(
      ImitationEventCellDefines.timeRange.id
    );
    const availability02: number =
      max -
      approvedEvent02.getCellValue(
        ImitationEventCellDefines.numParticipants.id
      );
    schedulePO.clickOnEvent(testPlay3.name);
    schedulePO.expectAvailability(timeRange01, availability01);
    schedulePO.expectAvailability(timeRange02, availability02);
  });

  it('Show over-availability error of event', () => {
    const timeRange01: TimeRange = approvedEvent01.getCellValue(
      ImitationEventCellDefines.timeRange.id
    );
    const availability01: number =
      testPlay3.getCellValue(ImitationPlayCellDefines.maximum.id) -
      approvedEvent01.getCellValue(
        ImitationEventCellDefines.numParticipants.id
      );
    schedulePO.moveEvent(testPlay3.name, timeRange01.start);
    schedulePO.expectErrorOverAvailability(
      testPlay3.name,
      numParticipants,
      availability01
    );
  });

  it('Drag a single event to target time-slot', () => {
    const targetSlot: Date = moment(dateRange.start)
      .add(1, 'day')
      .add(13, 'hour')
      .toDate();
    schedulePO.moveEvent(testPlay1.name, targetSlot);
    schedulePO.expectEventInTimeSlot(testPlay1.name, targetSlot);
  });

  it('Show off-business-hours error of event', () => {
    const targetSlot: Date = moment(dateRange.start)
      .add(1, 'day')
      .add(9, 'hour')
      .toDate();
    schedulePO.moveEvent(testPlay1.name, targetSlot);
    schedulePO.expectErrorOffBusinessHours(testPlay1.name);
  });
});
