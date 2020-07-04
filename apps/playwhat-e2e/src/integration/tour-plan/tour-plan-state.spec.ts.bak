import { ImitationTourPlan } from '@ygg/playwhat/core';
import {
  SiteNavigator,
  TourPlanAdminPageObjectCypress,
  TourPlanPageObjectCypress
} from '@ygg/playwhat/test';
import { Month } from '@ygg/shared/omni-types/core';
import {
  getCurrentUser,
  login,
  theMockDatabase
} from '@ygg/shared/test/cypress';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { ImitationOrder } from '@ygg/shopping/core';
import { TheThing, TheThingState } from '@ygg/the-thing/core';
import {
  MyThingsDataTablePageObjectCypress,
  MyThingsPageObjectCypress
} from '@ygg/the-thing/test';
import { flatten, keys, mapValues, values } from 'lodash';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import {
  MinimalTourPlan,
  stubTourPlansByStateAndMonth,
  TourPlanInApplication,
  TourPlanPaid,
  TourPlanWithPlaysAndEquipments
} from './sample-tour-plan';

const tourPlansByStateAndMonth: {
  [state: string]: TheThing[];
} = stubTourPlansByStateAndMonth();

const siteNavigator = new SiteNavigator();
const SampleTourPlans = [TourPlanInApplication, TourPlanPaid].concat(
  flatten(values(tourPlansByStateAndMonth))
);

const tourPlansByState = mapValues(ImitationTourPlan.states, state => {
  const tourPlan = TourPlanWithPlaysAndEquipments.clone();
  tourPlan.name = `測試遊程狀態：${state.label}`;
  ImitationTourPlan.setState(tourPlan, state);
  return tourPlan;
});

const SampleThings = SamplePlays.concat(SampleEquipments)
  .concat(SampleTourPlans)
  .concat(values(tourPlansByState));

const tourPlanAdminPO = new TourPlanAdminPageObjectCypress();
const tourPlanPO = new TourPlanPageObjectCypress();
const myTourPlansPO = new MyThingsDataTablePageObjectCypress(
  '',
  ImitationTourPlan
);
// let incomeRecord: IncomeRecord;

describe('States button accessibility', () => {
  before(() => {
    login().then(user => {
      theMockDatabase.setAdmins([user.id]);
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });
      cy.visit('/');
    });
  });

  beforeEach(() => {
    // Reset tour-plan states
    getCurrentUser().then(user => {
      theMockDatabase.setAdmins([user.id]);
      cy.wrap(values(tourPlansByState)).each((tourPlan: any) => {
        theMockDatabase.insert(
          `${TheThing.collection}/${tourPlan.id}`,
          tourPlan
        );
      });
      cy.visit('/');
      cy.pause();
    });
  });

  after(() => {
    theMockDatabase.clear();
    // theMockDatabase.restoreRTDB();
  });

  it('Can set state approved only if admin and state applied', () => {
    theMockDatabase.setAdmins([]);
    cy.wrap(values(ImitationTourPlan.states)).each((state: TheThingState) => {
      const tourPlan = tourPlansByState[state.name];
      cy.visit(`/${ImitationTourPlan.routePath}/${tourPlan.id}`);
      tourPlanPO.expectVisible();
      tourPlanPO.theThingPO.expectName(tourPlan.name);
      tourPlanPO.theThingPO.expectNoActionButton(
        ImitationTourPlan.actions['approve-available']
      );
    });
    const tourPlanApplied =
      tourPlansByState[ImitationTourPlan.states.applied.name];
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(tourPlanApplied);
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.applied);
    tourPlanPO.theThingPO.expectNoActionButton(
      ImitationTourPlan.actions['approve-available']
    );
    getCurrentUser().then(user => theMockDatabase.setAdmins([user.id]));
    tourPlanPO.theThingPO.expectActionButton(
      ImitationTourPlan.actions['approve-available']
    );
    // theMockDatabase.restoreRTDB();
  });

  // it('Can set state paid only if admin and state approved', () => {
  //   theMockDatabase.setAdmins([]);
  //   cy.wrap(values(ImitationTourPlan.states)).each((state: TheThingState) => {
  //     const tourPlan = tourPlansByState[state.name];
  //     cy.visit(`/${ImitationTourPlan.routePath}/${tourPlan.id}`);
  //     tourPlanPO.expectVisible();
  //     tourPlanPO.theThingPO.expectName(tourPlan.name);
  //     tourPlanPO.theThingPO.expectNoActionButton(
  //       ImitationTourPlan.actions['confirm-paid']
  //     );
  //   });
  //   const tourPlanApproved =
  //     tourPlansByState[ImitationTourPlan.states.approved.name];
  //   siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
  //   myTourPlansPO.theThingDataTablePO.gotoTheThingView(tourPlanApproved);
  //   tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.approved);
  //   tourPlanPO.theThingPO.expectNoActionButton(
  //     ImitationTourPlan.actions['confirm-paid']
  //   );
  //   getCurrentUser().then(user => theMockDatabase.setAdmins([user.id]));
  //   tourPlanPO.theThingPO.expectActionButton(
  //     ImitationTourPlan.actions['confirm-paid']
  //   );
  //   // theMockDatabase.restoreRTDB();
  // });

  // it('Can set state completed only if admin and state paid', () => {
  //   theMockDatabase.setAdmins([]);
  //   cy.wrap(values(ImitationTourPlan.states)).each((state: TheThingState) => {
  //     const tourPlan = tourPlansByState[state.name];
  //     cy.visit(`/${ImitationTourPlan.routePath}/${tourPlan.id}`);
  //     tourPlanPO.expectVisible();
  //     tourPlanPO.theThingPO.expectName(tourPlan.name);
  //     tourPlanPO.theThingPO.expectNoActionButton(
  //       ImitationTourPlan.actions['confirm-completed']
  //     );
  //   });
  //   const tourPlanPaid = tourPlansByState[ImitationTourPlan.states.paid.name];
  //   siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
  //   myTourPlansPO.theThingDataTablePO.expectTheThing(tourPlanPaid);
  //   myTourPlansPO.theThingDataTablePO.gotoTheThingView(tourPlanPaid);
  //   tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.paid);
  //   tourPlanPO.theThingPO.expectNoActionButton(
  //     ImitationTourPlan.actions['confirm-completed']
  //   );
  //   getCurrentUser().then(user => theMockDatabase.setAdmins([user.id]));
  //   tourPlanPO.theThingPO.expectActionButton(
  //     ImitationTourPlan.actions['confirm-completed']
  //   );
  //   theMockDatabase.restoreRTDB();
  // });

  // it('Can send application tour plan only if owner and state editing', () => {
  //   const tourPlanNotMine = MinimalTourPlan.clone();
  //   tourPlanNotMine.name = '測試遊程(不是我的)';
  //   ImitationTourPlan.setState(
  //     tourPlanNotMine,
  //     ImitationTourPlan.states.editing
  //   );
  //   theMockDatabase.insert(
  //     `${TheThing.collection}/${tourPlanNotMine.id}`,
  //     tourPlanNotMine
  //   );
  //   cy.wrap(values(ImitationTourPlan.states)).each((state: TheThingState) => {
  //     const tourPlan = tourPlansByState[state.name];
  //     cy.visit(`/${ImitationTourPlan.routePath}/${tourPlan.id}`);
  //     tourPlanPO.expectVisible();
  //     tourPlanPO.theThingPO.expectName(tourPlan.name);
  //     if (state.name === ImitationTourPlan.states.editing.name) {
  //       tourPlanPO.theThingPO.expectActionButton(
  //         ImitationTourPlan.actions['send-application']
  //       );
  //     } else {
  //       tourPlanPO.theThingPO.expectNoActionButton(
  //         ImitationTourPlan.actions['send-application']
  //       );
  //     }
  //   });
  //   cy.visit(`${ImitationTourPlan.routePath}/${tourPlanNotMine.id}`);
  //   tourPlanPO.expectVisible();
  //   tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.editing);
  //   tourPlanPO.theThingPO.expectNoActionButton(
  //     ImitationTourPlan.actions['send-application']
  //   );
  // });

  // it('Can withdraw tour-plan to editing only if admin and state applied', () => {
  //   theMockDatabase.setAdmins([]);
  //   cy.wrap(values(ImitationTourPlan.states)).each((state: TheThingState) => {
  //     const tourPlan = tourPlansByState[state.name];
  //     cy.visit(`/${ImitationTourPlan.routePath}/${tourPlan.id}`);
  //     tourPlanPO.expectVisible();
  //     tourPlanPO.theThingPO.expectNoActionButton(
  //       ImitationTourPlan.actions['cancel-application']
  //     );
  //   });
  //   getCurrentUser().then(user => theMockDatabase.setAdmins([user.id]));
  //   cy.wrap(values(ImitationTourPlan.states)).each((state: TheThingState) => {
  //     const tourPlan = tourPlansByState[state.name];
  //     cy.visit(`/${ImitationTourPlan.routePath}/${tourPlan.id}`);
  //     tourPlanPO.expectVisible();
  //     if (state.name === ImitationTourPlan.states.applied.name) {
  //       tourPlanPO.theThingPO.expectActionButton(
  //         ImitationTourPlan.actions['cancel-application']
  //       );
  //     } else {
  //       tourPlanPO.theThingPO.expectNoActionButton(
  //         ImitationTourPlan.actions['cancel-application']
  //       );
  //     }
  //   });
  // });

  // it('Only tour-plans of state "new", "editing" are modifiable', () => {
  //   cy.wrap(values(ImitationTourPlan.states)).each((state: TheThingState) => {
  //     const tourPlan = tourPlansByState[state.name];
  //     cy.visit(`/${ImitationTourPlan.routePath}/${tourPlan.id}`);
  //     tourPlanPO.expectVisible();
  //     tourPlanPO.theThingPO.expectName(tourPlan.name);
  //     if (
  //       state.name === ImitationTourPlan.states.new.name ||
  //       state.name === ImitationTourPlan.states.editing.name
  //     ) {
  //       tourPlanPO.expectModifiable();
  //     } else {
  //       tourPlanPO.expectReadonly();
  //     }
  //   });
  // });
});
