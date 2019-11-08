import { loginAdmin } from '../../page-objects/app.po';
import { SiteNavigator } from '../../page-objects/site-navigator';
import { Play } from '@ygg/playwhat/play';
// import { v4 as uuid } from 'uuid';
import { TagsAdminListPageObjectCypress } from '../../page-objects/tags/tags-admin-list.po';
import { SchedulePlan } from '@ygg/schedule/core';
import { MockDatabase } from '../../support/mock-database';

describe('Add new tags from various user activities', () => {
  const siteNavigator = new SiteNavigator();
  const tagsAdminListPageObject = new TagsAdminListPageObjectCypress();
  const mockDatabase: MockDatabase = new MockDatabase();

  before(() => {
    cy.visit('/');
    loginAdmin();
  });

  after(() => {
    mockDatabase.clear();
  });

  it('From creating/updating play', () => {
    const testPlay = Play.forge();
    mockDatabase.insert(`plays/${testPlay.id}`, testPlay.toJSON()).then(() => {
      siteNavigator.goto(['admin', 'tags', 'list']);
      tagsAdminListPageObject.expectTags(testPlay.tags.toTagsArray());
    });
  });

  it('From creating/updating schedule-plan', () => {
    const testSchedulePlan = SchedulePlan.forge();
    mockDatabase
      .insert(
        `schedule-plans/${testSchedulePlan.id}`,
        testSchedulePlan.toJSON()
      )
      .then(() => {
        siteNavigator.goto(['admin', 'tags', 'list']);
        tagsAdminListPageObject.expectTags(testSchedulePlan.tags.toTagsArray());
      });
  });
});
