import {
  CellDefinesTourPlan,
  ImitationTourPlan,
  ImitationTourPlanCellDefines,
  ImitationEvent,
  ImitationEventCellDefines
} from '@ygg/playwhat/core';
import { SiteNavigator, TourPlanPageObjectCypress } from '@ygg/playwhat/test';
import { SchedulePageObjectCypress } from '@ygg/schedule/test';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import { waitForLogin } from '@ygg/shared/user/test';
import { TheThing } from '@ygg/the-thing/core';
import { MyThingsDataTablePageObjectCypress, TheThingPageObjectCypress } from '@ygg/the-thing/test';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import {
  ScheduleTrivial,
  TourPlanUnscheduled,
  ScheduledEvents
} from '../schedule/sample-schedules';
import { find } from 'lodash';

describe('Create events', () => {
  const siteNavigator = new SiteNavigator();
  const SampleThings = SamplePlays.concat(SampleEquipments).concat([
    TourPlanUnscheduled
  ]);
  const tourPlanPO = new TourPlanPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress(
    '',
    ImitationTourPlan
  );
  const eventPO = new TheThingPageObjectCypress('', ImitationEvent);
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
    theMockDatabase.clear();
  });

  it('Create events from tour-plan', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanUnscheduled);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.runAction(ImitationTourPlan.actions['schedule']);
    schedulePO.expectVisible();
    schedulePO.expectSchedule(ScheduleTrivial);
    schedulePO.submit();
    // cy.wait(10000);
    tourPlanPO.expectVisible();
    tourPlanPO.expectEvents(ScheduledEvents);
    cy.wrap(ScheduledEvents).each((event: TheThing) => {
      tourPlanPO.gotoEventView(event);
      eventPO.expectVisible();
      eventPO.expectValue(event);
      cy.go('back');
      tourPlanPO.expectVisible();
    });
  });
});
