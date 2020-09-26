import {
  CellDefines as PlaywhatCellDefines,
  ImitationEvent,
  ImitationTourPlan,
  ImitationEventCellDefines
} from '@ygg/playwhat/core';
import { SiteNavigator, TourPlanPageObjectCypress } from '@ygg/playwhat/test';
import { SchedulePageObjectCypress } from '@ygg/schedule/test';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import { loginTestUser, testUsers, waitForLogin } from '@ygg/shared/user/test';
import { TheThing } from '@ygg/the-thing/core';
import {
  MyThingsDataTablePageObjectCypress,
  TheThingPageObjectCypress
} from '@ygg/the-thing/test';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import {
  ScheduledEvents,
  ScheduleTrivial,
  TourPlanUnscheduled
} from '../schedule/sample-schedules';
import { TimeRange } from '@ygg/shared/omni-types/core';
import { beforeAll } from '../../support/before-all';

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
      PlaywhatCellDefines.dateRange.id
    ),
    dayTimeRange: TourPlanUnscheduled.getCellValue(
      PlaywhatCellDefines.dayTimeRange.id
    )
  });

  const me = testUsers[0];

  before(() => {
    beforeAll();
    // Only Admin user can make schedule
    theMockDatabase.setAdmins([me.id]);
    cy.wrap(SampleThings).each((thing: any) => {
      thing.ownerId = me.id;
      theMockDatabase.insert(`${thing.collection}/${thing.id}`, thing);
    });
    cy.visit('/');
    loginTestUser(me);
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
    cy.wrap(ScheduledEvents).each((tEvent: TheThing) => {
      schedulePO.moveEvent(
        tEvent.name,
        (tEvent.getCellValue(
          ImitationEventCellDefines.timeRange.id
        ) as TimeRange).start
      );
    });
    schedulePO.submit();
    cy.wait(30000);
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
