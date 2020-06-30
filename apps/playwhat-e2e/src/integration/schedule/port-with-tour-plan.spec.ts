import { TourPlanPageObjectCypress, SiteNavigator } from '@ygg/playwhat/test';
import {
  ImitationTourPlan,
  ScheduleAdapter,
  CellDefinesTourPlan
} from '@ygg/playwhat/core';
import { Schedule } from '@ygg/schedule/core';
import { TourPlanUnscheduled, ScheduleTrivial } from './sample-schedules';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import { SamplePlays, SampleEquipments } from '../play/sample-plays';
import { waitForLogin } from '@ygg/shared/user/test';
import {
  MyThingsPageObjectCypress,
  MyThingsDataTablePageObjectCypress
} from '@ygg/the-thing/test';
import { SchedulePageObjectCypress } from '@ygg/schedule/test';
import { TheThing } from '@ygg/the-thing/core';
import { CellNames } from '@ygg/shopping/core';

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
  const schedulePO = new SchedulePageObjectCypress();

  before(() => {
    // Only tour-plans of state applied can make schedule
    ImitationTourPlan.setState(
      TourPlanUnscheduled,
      ImitationTourPlan.states.applied
    );

    login().then(user => {
      // Only Admin user can make schedule
      theMockDatabase.setAdmins([user.id]);
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${thing.collection}/${thing.id}`, thing);
      });
    });
  });

  beforeEach(() => {
    cy.visit('/');
    waitForLogin();
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
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(
      TourPlanUnscheduled
    );
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.runAction(ImitationTourPlan.actions['schedule']);
    schedulePO.expectVisible();
    schedulePO.expectDateRange(
      TourPlanUnscheduled.getCellValue(
        CellDefinesTourPlan.dateRange.name
      )
    );
  });

  it('Apply day-time-range from tour-plan', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(
      TourPlanUnscheduled
    );
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.runAction(ImitationTourPlan.actions['schedule']);
    schedulePO.expectVisible();
    const dayTimeRange = TourPlanUnscheduled.getCellValue(
      CellDefinesTourPlan.dayTimeRange.name
    );
    console.log(dayTimeRange);
    schedulePO.expectDayTimeRange(dayTimeRange);
  });  

  it('Create a trivial schedule from tour-plan', () => {
    const scheduleEvents: TheThing[] = ScheduleTrivial.events.map(
      se => ScheduleAdapter.deriveEventFromServiceEvent(se)
    );
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(
      TourPlanUnscheduled
    );
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.runAction(ImitationTourPlan.actions['schedule']);
    schedulePO.expectVisible();
    schedulePO.expectSchedule(ScheduleTrivial);
    schedulePO.submit();
    tourPlanPO.expectVisible();
    tourPlanPO.expectEvents(scheduleEvents);
  });

});
