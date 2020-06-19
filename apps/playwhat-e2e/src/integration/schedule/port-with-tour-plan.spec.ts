import { TourPlanPageObjectCypress, SiteNavigator } from '@ygg/playwhat/test';
import { ImitationTourPlan, ScheduleAdapter } from '@ygg/playwhat/core';
import { Schedule } from '@ygg/schedule/core';

import {
  ScheduleFromTourPlanWithPlaysAndEquipments,
  ScheduleFromTourPlanWithPlaysNoEquipment
} from './sample-schedules';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import { SamplePlays, SampleEquipments } from '../play/sample-plays';
import { waitForLogin } from '@ygg/shared/user/test';
import {
  MyThingsPageObjectCypress,
  MyThingsDataTablePageObjectCypress
} from '@ygg/the-thing/test';
import {
  TourPlanWithPlaysAndEquipments,
  TourPlanWithPlaysNoEquipment
} from '../tour-plan/sample-tour-plan';
import { SchedulePageObjectCypress } from '@ygg/schedule/test';
import { TheThing } from '@ygg/the-thing/core';

describe('Create/Attach schedule data from/to tour-plan', () => {
  const siteNavigator = new SiteNavigator();
  const SampleThings = SamplePlays.concat(SampleEquipments).concat([
    TourPlanWithPlaysNoEquipment
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
      TourPlanWithPlaysAndEquipments,
      ImitationTourPlan.states.applied
    );
    ImitationTourPlan.setState(
      TourPlanWithPlaysNoEquipment,
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

  it('Create a trivial schedule from tour-plan', () => {
    const scheduleEvents: TheThing[] = ScheduleFromTourPlanWithPlaysNoEquipment.events.map(
      se => ScheduleAdapter.deriveEventFromServiceEvent(se)
    );
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(
      TourPlanWithPlaysNoEquipment
    );
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.runAction(ImitationTourPlan.actions['schedule']);
    schedulePO.expectVisible();
    schedulePO.expectSchedule(ScheduleFromTourPlanWithPlaysNoEquipment);
    schedulePO.submit();
    tourPlanPO.expectVisible();
    tourPlanPO.expectEvents(scheduleEvents);
  });
});
