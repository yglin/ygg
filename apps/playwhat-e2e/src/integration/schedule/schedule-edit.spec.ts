import {
  CellDefinesTourPlan,
  ImitationTourPlan,
  ScheduleAdapter,
  ImitationTourPlanCellDefines,
  RelationshipPlay,
  ImitationPlayCellDefines,
  RelationNamePlay,
  ImitationEvent
} from '@ygg/playwhat/core';
import { SiteNavigator, TourPlanPageObjectCypress } from '@ygg/playwhat/test';
import { SchedulePageObjectCypress } from '@ygg/schedule/test';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import { waitForLogin } from '@ygg/shared/user/test';
import { TheThing } from '@ygg/the-thing/core';
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
  const plays = SamplePlays.filter(play =>
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

  const testPlay1 = plays[0];
  // Test business-hours 01 Monday to Friday, 10:00 - 15:30
  const testBusinessHours01 = new BusinessHours();
  let dayTimeRage = new DayTimeRange(new DayTime(10, 0), new DayTime(15, 30));
  testBusinessHours01.addOpenHour(new OpenHour(WeekDay.Monday, dayTimeRage));
  testBusinessHours01.addOpenHour(new OpenHour(WeekDay.Tuesday, dayTimeRage));
  testBusinessHours01.addOpenHour(new OpenHour(WeekDay.Wednesday, dayTimeRage));
  testBusinessHours01.addOpenHour(new OpenHour(WeekDay.Thursday, dayTimeRage));
  testBusinessHours01.addOpenHour(new OpenHour(WeekDay.Friday, dayTimeRage));
  testPlay1.setCellValue(
    ImitationPlayCellDefines.businessHours.name,
    testBusinessHours01
  );

  const testPlay2 = plays[1];
  // Test business-hours 02 Saturdy to Sunday, 12:30 - 17:30
  const testBusinessHours02 = new BusinessHours();
  dayTimeRage = new DayTimeRange(new DayTime(12, 0), new DayTime(17, 30));
  testBusinessHours02.addOpenHour(new OpenHour(WeekDay.Saturday, dayTimeRage));
  testBusinessHours02.addOpenHour(new OpenHour(WeekDay.Sunday, dayTimeRage));
  testPlay2.setCellValue(
    ImitationPlayCellDefines.businessHours.name,
    testBusinessHours02
  );

  before(() => {
    // Only tour-plans of state applied can make schedule
    login().then(user => {
      // Only Admin user can make schedule
      theMockDatabase.setAdmins([user.id]);
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${thing.collection}/${thing.id}`, thing);
      });
      cy.visit('/');
      waitForLogin();
      siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
      myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanUnscheduled);
      tourPlanPO.expectVisible();
      tourPlanPO.theThingPO.runAction(ImitationTourPlan.actions['schedule']);
      schedulePO.expectVisible();
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
    schedulePO.expectBusinessHours(testBusinessHours01, testPlay1.color);
    schedulePO.clickOnEvent(testPlay2.name);
    schedulePO.expectBusinessHours(testBusinessHours02, testPlay2.color);
  });

  it('Drag a single event to target time-slot', () => {
    // XXX yglin 2020/07/15: use narrower date range to prevent the weird scrolling during drag-n-drop,
    // Don't know why but it fucked up the coordinate of target droppable
    const newDateRange = new DateRange(
      nextMonday.toDate(),
      nextMonday.add(2, 'day').toDate()
    );
    TourPlanUnscheduled.setCellValue(
      ImitationTourPlanCellDefines.dateRange.name,
      newDateRange
    );
    theMockDatabase
      .insert(
        `${TourPlanUnscheduled.collection}/${TourPlanUnscheduled.id}`,
        TourPlanUnscheduled
      )
      .then(() => {
        const play = plays[0];
        // move event to second day 13:00
        const targetStart: Date = moment(newDateRange.start)
          .add(1, 'day')
          .add(13, 'hour')
          .toDate();
        const targetTimeRange: TimeRange = new TimeRange(
          targetStart,
          moment(targetStart)
            .add(
              play.getCellValue(ImitationPlayCellDefines.timeLength.name),
              'minute'
            )
            .toDate()
        );
        siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
        myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanUnscheduled);
        tourPlanPO.expectVisible();
        tourPlanPO.theThingPO.runAction(ImitationTourPlan.actions['schedule']);
        schedulePO.expectVisible();
          schedulePO.moveEvent(play.name, targetStart);
        schedulePO.expectEventInTimeSlot(play.name, targetStart);
        schedulePO.submit();
        tourPlanPO.expectVisible();
        tourPlanPO.expectEventTimeRange(play.name, targetTimeRange);
      });
  });
});
