import { login } from '../page-objects/app.po';
import { SiteNavigator } from '../page-objects/site-navigator';
import { PlayFormPageObject } from '../page-objects/play.po';
import { Play } from '@ygg/playwhat/play';
import { Tags, Tag } from '@ygg/tags/core';
import { v4 as uuid } from 'uuid';
import { TagsAdminListPageObjectCypress } from '../page-objects/tags/tags-admin-list.po';
import { Scheduler } from '../page-objects';
import { ScheduleForm } from '@ygg/playwhat/scheduler';

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

  // it('From creating/updating play', () => {
  //   siteNavigator.goto(['plays', 'new']);
  //   testPlay.tags = testTags;
  //   playFormPageObject.fillIn(testPlay);
  //   playFormPageObject.submit();
  //   cy.url().should('not.match', /\/plays\/new/);
  //   cy.url().should('match', /\/plays\/(.+)/);

  //   cy.location().then(loc => {
  //     // Clean out test data in Database
  //     const matched = loc.pathname.match(/\/plays\/(.+)/);
  //     const newPlayId = matched[1];
  //     cy.log(`The new play id = "${newPlayId}"`);
  //     cy.wrap(newPlayId).as('newPlayId');
  //   });

  //   siteNavigator.goto(['admin', 'tags', 'list']);
  //   tagsAdminListPageObject.expectTags(testPlay.tags.toTagsArray());

  //   cy.get('@newPlayId').then(newPlayId => {
  //     // @ts-ignore
  //     cy.callFirestore('delete', `plays/${newPlayId}`);
  //     // Delete test tags
  //     cy.wrap(testTags.toTagsArray()).each((element, index, array) => {
  //       // @ts-ignore
  //       cy.callFirestore('delete', `tags/${(element as Tag).id}`);
  //     });
  //   });
  // });

  it('From creating schedule-form', () => {
    testScheduleForm.likeTags = testTags;
    siteNavigator.goto(['scheduler', 'new']);
    scheduleFormPage.setValue(testScheduleForm);
    scheduleFormPage.submit();
    cy.location().then(loc => {
      // Clean out test data in Database
      const matched = loc.pathname.match(/\/schedule-forms\/(.+)/);
      const newScheduleFormId = matched[1];
      cy.log(`The new play id = "${newScheduleFormId}"`);
      cy.wrap(newScheduleFormId).as('newScheduleFormId');
    });

    siteNavigator.goto(['admin', 'tags', 'list']);
    tagsAdminListPageObject.expectTags(testScheduleForm.likeTags.toTagsArray());

    cy.get('@newScheduleFormId').then(newScheduleFormId => {
      // @ts-ignore
      cy.callFirestore('delete', `schedule-forms/${newScheduleFormId}`);
      // Delete test tags
      cy.wrap(testTags.toTagsArray()).each((element, index, array) => {
        // @ts-ignore
        cy.callFirestore('delete', `tags/${(element as Tag).id}`);
      });
    });
  });
  
});
