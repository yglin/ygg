import { last } from "lodash";
import { login } from '../../page-objects/app.po';
import { SiteNavigator } from '../../page-objects/site-navigator';
import { PlayFormPageObject, deletePlay } from '../../page-objects/play.po';
import { Play } from '@ygg/playwhat/play';
import { Tags, Tag } from '@ygg/tags/core';
// import { v4 as uuid } from 'uuid';
import { TagsAdminListPageObjectCypress } from '../../page-objects/tags/tags-admin-list.po';
import { Scheduler } from '../../page-objects';
import { SchedulePlan } from '@ygg/playwhat/scheduler';
import { deleteSchedulePlan } from "../../page-objects/scheduler";
import { deleteTags } from '../../page-objects/tags';

describe('Add new tags from various user activities', () => {
  const siteNavigator = new SiteNavigator();
  const tagsAdminListPageObject = new TagsAdminListPageObjectCypress();
  const testPlay = Play.forge();
  const testSchedulePlan = SchedulePlan.forge();
  const testTags = Tags.forge();
  const playFormPageObject = new PlayFormPageObject();
  const schedulePlanPage = new Scheduler.SchedulePlanPageObjectCypress('');

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
    deleteTags(testPlay.tags);
  });

  it('From creating/updating schedule-plan', () => {
    testSchedulePlan.tags = testTags;
    siteNavigator.goto(['scheduler', 'new']);
    schedulePlanPage.setValue(testSchedulePlan);
    schedulePlanPage.submit();
    cy.url().should('not.match', /.*scheudler\/new.*/);
    cy.location('pathname').then((loc: any) => {
      const pathname: string = loc as string;
      // Clean out test data in Database
      const id = last(pathname.split('/'));
      if (id) {
        testSchedulePlan.id = id;
      }
    });
    siteNavigator.goto(['admin', 'tags', 'list']);
    tagsAdminListPageObject.expectTags(testSchedulePlan.tags.toTagsArray());
    deleteSchedulePlan(testSchedulePlan);
    deleteTags(testSchedulePlan.tags);
  });
});
