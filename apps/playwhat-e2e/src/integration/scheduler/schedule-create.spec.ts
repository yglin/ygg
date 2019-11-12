import { random, range, sample } from 'lodash';
import { login, insertDB } from '../../page-objects/app.po';
import {
  deleteSchedulePlan,
  gotoMySchedulePlanView
} from '../../page-objects/scheduler';
import { SchedulePlan } from '@ygg/schedule/core';
import { SchedulePlanViewPagePageObject } from '@ygg/schedule/frontend';
import { deleteTags } from '../../page-objects/tags';
import { SchedulePlanViewPagePageObjectCypress } from '../../page-objects/scheduler/schedule-plan-view-page.po';
import { MockDatabase } from '../../support/mock-database';
import { Play } from '@ygg/playwhat/play';
import { Tags } from '@ygg/tags/core';

describe('Create a new schedule from schedule-plan', () => {
  // const testSchedulePlans: SchedulePlan[] = [];
  const scheduleEditPageObject = new ScheduleEditPaegObjectCypress('');
  const mockDatabase = new MockDatabase();
  const testSchedulePlan = SchedulePlan.forge();
  const tagsMatchedPlays: Play[] = range(random(3, 7)).map(() => {
    const play = Play.forge();
    play.tags.push(sample(testSchedulePlan.tags.toTagsArray));
    return play;
  });

  before(function() {
    cy.visit('/');
    login().then(user => {
      testSchedulePlan.creatorId = user.id;
      mockDatabase
        .insert(`schedule-plans/${testSchedulePlan.id}`, testSchedulePlan)
        .then(() => {
          cy.wrap(tagsMatchedPlays).each((play: Play) =>
            mockDatabase.insert(`plays/${play.id}`, play.toJSON())
          );
          cy.wrap(testSchedulePlan).as('testSchedulePlan');
        });
    });
  });

  after(function() {
    mockDatabase.clear();
  });

  beforeEach(function() {
    // Go to page of new schedule derived from test schedule-plan
    cy.get<SchedulePlan>('@testSchedulePlan').then(testSchedulePlan => {
      cy.log('======= Go to the view page of test schedule plan');
      gotoMySchedulePlanView(testSchedulePlan);
      cy.log('======= Click the create-schedule button');
      const schedulePlanViewPagePageObject: SchedulePlanViewPagePageObject = new SchedulePlanViewPagePageObjectCypress(
        ''
      );
      schedulePlanViewPagePageObject.createSchedule();
    });
  });

  it('should match url path "/scheduler/schedules/:id/edit/"', () => {
    cy.log("======= Should land on new schedule's edit page now");
    cy.url().should('match', /scheduler\/schedules\/.*\/edit/);
  });

  it('should promote plays which match tags of schedule-plan', () => {
    const playSelectorPageObject = new PlaySelectorPageObjectCypress();
    playSelectorPageObject.expectPlays(tagsMatchedPlays);
  });

  it('should show time-tables of each day in planned date range', () => {
    cy.wrap(testSchedulePlan.dateRange.toDateArray()).each((date: Date) => {
      const timeTablePageObject = scheduleEditPageObject.getTimeTablePO(date);
      timeTablePageObject.expectDate(date);
    });
  });
});
