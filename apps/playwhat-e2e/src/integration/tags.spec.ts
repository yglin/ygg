import { login } from '../page-objects/app.po';
import { SiteNavigator } from '../page-objects/site-navigator';
import {
  PlayFormPageObject,
  PlayViewPageObject
} from '../page-objects/play.po';
import { PageObjects } from '@ygg/playwhat/play';
import { Play } from '@ygg/playwhat/play';
import { v4 as uuid } from 'uuid';
import { AngularCypressTester } from '@ygg/shared/infra/test-utils/cypress';

describe('New tags source from user inputs in various scenarios', () => {
  const siteNavigator = new SiteNavigator();
  const tester = new AngularCypressTester({});
  const adminPlayTagsPageObject = new PageObjects.AdminPlayTagsPageObject(
    tester
  );
  const testPlay = Play.forge();
  const testTag = uuid();
  testPlay.tags.push(testTag);
  const playFormPageObject = new PlayFormPageObject();

  beforeEach(() => {
    cy.visit('/');
    login();
  });

  it('From new play', async () => {
    siteNavigator.goto(['plays', 'new']);
    playFormPageObject.fillIn(testPlay);
    playFormPageObject.submit();
    cy.url().should('match', /\/plays\/(.+)/);

    cy.location().then(loc => {
      // Clean out test data in Database
      const matched = loc.pathname.match(/\/plays\/(.+)/);
      const newPlayId = matched[1];
      cy.log(`The new play id = "${newPlayId}"`);
      cy.wrap(newPlayId).as('newPlayId');
    });

    siteNavigator.goto(['admin', 'play', 'tags']).then(() => {
      adminPlayTagsPageObject.expectTag(testTag);
      adminPlayTagsPageObject.removeTag(testTag);
      cy.get('@newPlayId').then(newPlayId => {
        // @ts-ignore
        cy.callFirestore('delete', `plays/${newPlayId}`);
      });
    });
  });
});
