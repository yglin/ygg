import { last } from "lodash";
import { login } from '../../page-objects/app.po';
import { SiteNavigator } from '../../page-objects/site-navigator';
import { PlayFormPageObject, deletePlay } from '../../page-objects/play.po';
import { Play } from '@ygg/playwhat/play';
import { Tags, Tag } from '@ygg/tags/core';
// import { v4 as uuid } from 'uuid';
import { TagsAdminListPageObjectCypress } from '../../page-objects/tags/tags-admin-list.po';
import { Scheduler } from '../../page-objects';
import { ScheduleForm } from '@ygg/playwhat/scheduler';
import { deleteScheduleForm } from "../../page-objects/scheduler";

describe('Add new tags from various user activities', () => {
  const siteNavigator = new SiteNavigator();
  const tagsAdminListPageObject = new TagsAdminListPageObjectCypress();
  const testPlay = Play.forge();
  const testScheduleForm = ScheduleForm.forge();
  const testTags = Tags.forge();
  const playFormPageObject = new PlayFormPageObject();
  const scheduleFormPage = new Scheduler.ScheduleFormPageObjectCypress('');

  beforeEach(() => {
    cy.visit('/');
    login();
  });

  it('From creating/updating play', () => {
    siteNavigator.goto(['plays', 'new']);
    testPlay.tags = testTags;
    playFormPageObject.fillIn(testPlay);
    playFormPageObject.submit();
    cy.url().should('not.match', /\/plays\/new/);
    cy.url().should('match', /\/plays\/(.+)/);

    cy.location('pathname').then((loc: any) => {
      const pathname: string = loc as string;
      // Clean out test data in Database
      const id = last(pathname.split('/'));
      if (id) {
        testPlay.id = id;
      }
    });

    siteNavigator.goto(['admin', 'tags', 'list']);
    tagsAdminListPageObject.expectTags(testPlay.tags.toTagsArray());

    deletePlay(testPlay);
  });

  it('From creating/updating schedule-form', () => {
    testScheduleForm.tags = testTags;
    siteNavigator.goto(['scheduler', 'new']);
    scheduleFormPage.setValue(testScheduleForm);
    scheduleFormPage.submit();
    cy.url().should('not.match', /.*scheudler\/new.*/);
    cy.location('pathname').then((loc: any) => {
      const pathname: string = loc as string;
      // Clean out test data in Database
      const id = last(pathname.split('/'));
      if (id) {
        testScheduleForm.id = id;
      }
    });
    siteNavigator.goto(['admin', 'tags', 'list']);
    tagsAdminListPageObject.expectTags(testScheduleForm.tags.toTagsArray());
    deleteScheduleForm(testScheduleForm);
  });
});
