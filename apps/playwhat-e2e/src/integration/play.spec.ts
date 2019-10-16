// import { sample } from "lodash";
// import { SerializableJSON } from '@ygg/shared/infra/data-access';
import { login } from '../page-objects/app.po';
import {
  PlayFormPageObject,
  PlayViewPageObject,
  deletePlay
} from '../page-objects/play.po';
import { Play } from '@ygg/playwhat/play';
import { SiteNavigator } from '../page-objects/site-navigator';

describe('Play form, new and update play', () => {
  const siteNavigator = new SiteNavigator();

  beforeEach(function() {
    cy.visit('/');
    login();
  });

  it('should create new Play and check data consistency', () => {
    const testPlay = Play.forge();
    const playFormPage = new PlayFormPageObject();
    const playViewPage = new PlayViewPageObject();
    siteNavigator.goto(['plays', 'new'])
    playFormPage.expectVisible();
    playFormPage.fillIn(testPlay);
    playFormPage.submit();
    playViewPage.expectVisible();
    playViewPage.checkData(testPlay);
    // should redirect to play-view
    cy.location().then(loc => {
      // Clean out test data in Database
      const matched = loc.pathname.match(/\/plays\/(.+)/);
      const newPlayId = matched[1];
      cy.log(`Created play id = ${newPlayId}`);
      testPlay.id = newPlayId;
      deletePlay(testPlay);
    });
  });

});
