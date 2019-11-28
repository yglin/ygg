import { last } from 'lodash';
import { SiteNavigator } from '../../page-objects/site-navigator';
import {
  PlayFormPageObject,
  PlayViewPageObject
} from '../../page-objects/play.po';
import { Play } from '@ygg/playwhat/play';
import { MockDatabase } from '../../support/mock-database';
import { User } from '@ygg/shared/user';
import { login } from '../../page-objects/app.po';
import { Equipment } from '@ygg/resource/core';

describe('Create Play', () => {
  const siteNavigator = new SiteNavigator();
  const mockDatabase = new MockDatabase();
  const testPlay = Play.forge();

  before(() => {
    cy.visit('/');
    login().then((user: any) => {
      cy.wrap(user).as('currentUser');
    });
  });

  it('should create play and show consist data', () => {
    const playFormPage = new PlayFormPageObject();
    siteNavigator.goto(['plays', 'new']);
    playFormPage.expectVisible();
    playFormPage.fillIn(testPlay);
    playFormPage.submit();
    cy.url().should('not.match', /\/plays\/new/);
    cy.location('pathname').then((pathnames: any) => {
      const id = last((pathnames as string).split('/'));
      testPlay.id = id;
      cy.log(`Created play id = ${id}`);
      const playViewPage = new PlayViewPageObject();
      playViewPage.expectVisible();
      playViewPage.checkData(testPlay);
      cy.get<User>('@currentUser').then(user => {
        playViewPage.expectCreator(user);
      });
      // Clear test data
      mockDatabase.delete(`plays/${id}`);
      cy.wrap(testPlay.tags.toTagsArray()).each((tag: any) =>
        mockDatabase.delete(`tags/${tag.id}`)
      );
      cy.wrap(testPlay.equipments).each((eq: Equipment) =>
        mockDatabase.delete(`resources/${eq.id}`)
      );
    });
  });
});
