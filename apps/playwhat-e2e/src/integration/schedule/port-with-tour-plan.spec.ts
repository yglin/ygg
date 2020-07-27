import {
  CellDefinesTourPlan,
  ImitationTourPlan,
  ScheduleAdapter,
  ImitationTourPlanCellDefines,
  ImitationEvent,
  ImitationEventCellDefines
} from '@ygg/playwhat/core';
import { SiteNavigator, TourPlanPageObjectCypress } from '@ygg/playwhat/test';
import { SchedulePageObjectCypress } from '@ygg/schedule/test';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import { waitForLogin } from '@ygg/shared/user/test';
import { TheThing } from '@ygg/the-thing/core';
import { MyThingsDataTablePageObjectCypress } from '@ygg/the-thing/test';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import {
  ScheduleTrivial,
  TourPlanUnscheduled,
  ScheduledEvents
} from './sample-schedules';
import { find } from 'lodash';

describe('Create/Attach schedule data from/to tour-plan', () => {
  const siteNavigator = new SiteNavigator();
  const SampleThings = SamplePlays.concat(SampleEquipments).concat([
    TourPlanUnscheduled
  ]);
  const tourPlanPO = new TourPlanPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress(
    '',
    ImitationTourPlan
  );
  // Only tour-plans of state applied can make schedule
  ImitationTourPlan.setState(
    TourPlanUnscheduled,
    ImitationTourPlan.states.applied
  );
  const schedulePO = new SchedulePageObjectCypress('', {
    dateRange: TourPlanUnscheduled.getCellValue(
      ImitationTourPlanCellDefines.dateRange.name
    ),
    dayTimeRange: TourPlanUnscheduled.getCellValue(
      ImitationTourPlanCellDefines.dayTimeRange.name
    )
  });

  // const scheduleEvents: TheThing[] = ScheduleTrivial.events.map(se => {
  //   const play: TheThing = find(SamplePlays, p => p.id === se.service.id);
  //   const event = ImitationEvent.createTheThing(play);
  //   event.setCellValue(
  //     ImitationEventCellDefines.timeRange.name,
  //     se.timeRange
  //   );
  //   event.setCellValue(
  //     ImitationEventCellDefines.numParticipants.name,
  //     se.numParticipants
  //   );
  //   return event;
  // });

  before(() => {
    login().then(user => {
      // Only Admin user can make schedule
      theMockDatabase.setAdmins([user.id]);
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${thing.collection}/${thing.id}`, thing);
      });
      cy.visit('/');
      waitForLogin();
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

  it('Apply date-range from tour-plan', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanUnscheduled);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.runAction(ImitationTourPlan.actions['schedule']);
    schedulePO.expectVisible();
    schedulePO.expectDateRange(
      TourPlanUnscheduled.getCellValue(CellDefinesTourPlan.dateRange.name)
    );
  });

  it('Apply day-time-range from tour-plan', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanUnscheduled);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.runAction(ImitationTourPlan.actions['schedule']);
    schedulePO.expectVisible();
    const dayTimeRange = TourPlanUnscheduled.getCellValue(
      CellDefinesTourPlan.dayTimeRange.name
    );
    schedulePO.expectDayTimeRange(dayTimeRange);
  });

  it('Create a trivial schedule from tour-plan', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanUnscheduled);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.runAction(ImitationTourPlan.actions['schedule']);
    schedulePO.expectVisible();
    schedulePO.expectSchedule(ScheduleTrivial);
    schedulePO.submit();
    tourPlanPO.expectVisible();
    tourPlanPO.expectEvents(ScheduledEvents);
  });

  it('Save schedule for tour-plan', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanUnscheduled);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.runAction(ImitationTourPlan.actions['schedule']);
    schedulePO.expectVisible();
    schedulePO.expectSchedule(ScheduleTrivial);
    schedulePO.submit();
    tourPlanPO.expectVisible();

    // Reload
    cy.visit('/');
    waitForLogin();
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanUnscheduled);
    tourPlanPO.expectVisible();
    tourPlanPO.expectEvents(ScheduledEvents);
  });
});
