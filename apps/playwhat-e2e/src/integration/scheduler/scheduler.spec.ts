import { login } from '../../page-objects/app.po';
import {
  createSchedulePlan,
  deleteSchedulePlan,
  gotoMySchedulePlanView
} from '../../page-objects/scheduler';
import { SchedulePlan, SchedulePlanViewPagePageObject } from '@ygg/playwhat/scheduler';
import { deleteTags } from '../../page-objects/tags';
import { SchedulePlanViewPagePageObjectCypress } from '../../page-objects/scheduler/schedule-plan-view-page.po';

// ================== What data we need ? ================
// A schedule, composite of events
// Events, each with start time, end time, and which play consumed
//
// ============================================================

// ================== What logics/constraints we need ? ================
// Q: How to define availability of event ?
// A:
//
// Q: How to define a resource consumption ?
// A:
//
// Q: When user selects plays to add, how to create events and insert them to schedule?
// A:
//
// Q: What's the relation between event and resource ?
// A: Event consumes resources, like play, with time span and quantity
//
// ============================================================

// ================== What UI components we need ? ================
// "Create schedule" button link in schedule-plan view page.
// Schedule edit page.
// Schedule form component
// Daily time table to show schedule events
// Event-thumbnail
// Swipe-slide for switching days, with left/right arrow buttons
// "Add-plays" button in schedule-plan component
// "Remove" button on event-thumbnail
// "moveToNextDay", "moveToPreviousDay" butttons on event-thumbnail
// Draggable event handler
// "landing" button on event-thumbnail
// Play list multi-selector
// ============================================================

describe('Create a new schedule from schedule-plan', () => {
  const testSchedulePlans: SchedulePlan[] = [];

  before(function() {
    cy.visit('/');
    login();
    cy.log('======= Create a test schedule form');
    createSchedulePlan(SchedulePlan.forge()).then(schedulePlan => {
      testSchedulePlans.push(schedulePlan);
      cy.wrap(schedulePlan).as('testSchedulePlan');
    });
  });

  after(function() {
    cy.wrap(testSchedulePlans).each((schedulePlan: any, index: number) => {
      deleteSchedulePlan(schedulePlan);
      deleteTags(schedulePlan.tags);
    });
  });

  beforeEach(function() {});

  it('should start from an exist schedule-plan, its view page', () => {
    cy.get<SchedulePlan>('@testSchedulePlan').then(testSchedulePlan => {
      cy.log('======= Go to the view page of test schedule form');
      gotoMySchedulePlanView(testSchedulePlan);
      cy.log('======= Click the create-schedule button');
      const schedulePlanViewPagePageObject: SchedulePlanViewPagePageObject = new SchedulePlanViewPagePageObjectCypress(
        ''
      );
      schedulePlanViewPagePageObject.createSchedule();
      cy.log("======= Should land on new schedule's edit page now");
      cy.url().should('match', /\/schedules\/.*\/edit/);
    });
  });

  // it('should automatic generate the first version schedule', () => {
  //   cy.log('======= Go to the view page of test schedule form');
  //   cy.log('======= Click the create-schedule button');
  //   cy.log("======= Should land on new schedule's edit page now");
  //   cy.log('======= Should show events of first version schedule');
  // });
});

// describe('Edit schedule', () => {
//   before(function() {
//     cy.visit('/');
//     login();
//     cy.log('======= Create a test schedule');
//   });

//   beforeEach(function() {
//     cy.log("======= Go to the test schedule's edit page");
//   });

//   it('should show day 1 of schedule at the beginning', () => {
//     cy.log('======= Get events in day 1');
//     cy.log('======= Expect events in day 1 are all shown');
//   });

//   it('should show next day when swipe right on page', () => {
//     cy.log('======= Swipe on page to right');
//     cy.log('======= Get events in day 2');
//     cy.log('======= Expect events in day 2 are all shown');
//   });

//   it('should show previous day when swipe left on page', () => {
//     cy.log('======= Swipe right, to day 2');
//     cy.log('======= Swipe left on page, back to day 1');
//     cy.log('======= Get events in day1');
//     cy.log('======= Expect events in day 1 are all shown');
//   });

//   it('should be able to add plays in schedule', () => {
//     cy.log('======= Click on add-plays button');
//     cy.log('======= Should show plays selector dialog');
//     cy.log('======= Select random plays and click submit button');
//     cy.log('======= Expect new events of selected plays inserted');
//   });

//   it('should be able to remove events out of schedule', () => {
//     cy.log("======= Click on event's delete button");
//     cy.log('======= Expect confirm dialog has shown up');
//     cy.log('======= Expect event is gone');
//   });

//   it('should move event to next day, same time, when click on its moveToNextDay button', () => {
//     cy.log("======= Click on event's moveToNextDay button");
//     cy.log('======= Expect confirm dialog has shown up');
//     cy.log('======= Expect event in day 2');
//     cy.log('======= Expect events in day 2 are all shown');
//   });

//   it('should move event to previous day, same time, when click on its moveToPreviousDay button', () => {
//     cy.log('======= Swipe to Day 2');
//     cy.log("======= Click on event's moveToPreviousDay button");
//     cy.log('======= Expect confirm dialog has shown up');
//     cy.log('======= Expect event in day 1');
//     cy.log('======= Expect events in day 1 are all shown');
//   });

//   it('should enter drag mode when press on event over 1 seconds', () => {
//     cy.log('======= Press on event and wait 1 second');
//     cy.log('======= Should ghost activated event at original slot');
//     cy.log('======= Should show a drag handler of the activated event');
//     cy.log('======= Should expend and show droppable time slots');
//   });

//   it('should show preview event at target slot when dragging event', () => {
//     cy.log('======= Press on event and wait 1 second');
//     cy.log('======= Drag event forward to next time slot');
//     cy.log('======= Expect a preview event in next time slot');
//     cy.log('======= Drag event further forward to next time slot');
//     cy.log('======= Expect a preview event in second next time slot');
//   });

//   it("should exit drag mode and commit change when click on activated event's landing button", () => {
//     cy.log('======= Press on event and wait 1 second');
//     cy.log('======= Drag event forward a time slot');
//     cy.log('======= Click on landing button');
//     cy.log('======= Expect event occupies the new time span');
//   });

//   it('should visualize availability in drag mode', () => {
//     cy.log('======= Press on event and wait 1 second');
//     cy.log('======= Get available time slots of activated event');
//     cy.log('======= Expect different color of available time slots');
//   });

//   // Allow events to overlap, it won't affect resources availability
//   // it('should swap 2 events when they touched on dragging one of them', () => {
//   //   cy.log('======= Press on event A and wait 1 second');
//   //   cy.log('======= Drag event A to touch event B');
//   //   cy.log('======= Expect a preview event A on original time slot B');
//   //   cy.log('======= Expect a preview event B on original time slot A');
//   //   cy.log('======= Click on landing button of event A');
//   //   cy.log('======= Expect event A start at original time slot B');
//   //   cy.log('======= Expect event B start at original time slot A');
//   // });

//   it('should check business-hours availability and show warnings as needed', () => {
//     cy.log('======= Press on event A and wait 1 second');
//     cy.log(
//       '======= Drag and drop event A to time slot outside its business-hours'
//     );
//     cy.log('======= Expect a warning indicator on event A');
//     cy.log('======= Click on the warning indicator');
//     cy.log(
//       '======= Expect availability warning dialog and message of out of business-hours'
//     );
//   });

//   it('should check quantity availability and show warnings as needed', () => {
//     cy.log('======= Press on event A and wait 1 second');
//     cy.log(
//       '======= Drag and drop event A to time slot where there is zero quantity available'
//     );
//     cy.log('======= Expect a warning indicator on event A');
//     cy.log('======= Click on the warning indicator');
//     cy.log(
//       '======= Expect availability warning dialog and message of none available'
//     );
//   });
// });
