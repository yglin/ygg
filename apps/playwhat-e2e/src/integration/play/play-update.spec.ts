import { Play } from '@ygg/playwhat/play';
import { MockDatabase } from '../../support/mock-database';
import { login } from '../../page-objects/app.po';
import { SiteNavigator } from '../../page-objects/site-navigator';
import { PlayListPageObjectCypress, PlayViewPagePageObjectCypress } from '../../page-objects/play';
import {
  PlayFormPageObject,
  PlayViewPageObject
} from '../../page-objects/play.po';

describe('Update Play', () => {
  const siteNavigator = new SiteNavigator();
  const mockDatabase = new MockDatabase();

  before(() => {
    cy.visit('/');
    login().then((user: any) => {
      const testPlay = Play.forge();
      testPlay.creatorId = user.id;
      mockDatabase.insert(`plays/${testPlay.id}`, testPlay.toJSON());
      cy.wrap(testPlay).as('testPlay');
    });
  });

  after(() => {
    mockDatabase.clear();
  });

  it('should be able to change play data and confirm the change', () => {
    cy.get<Play>('@testPlay').then(testPlay => {
      siteNavigator.goto(['plays', 'my', 'list']);
      const myPlayListPage = new PlayListPageObjectCypress();
      myPlayListPage.expectPlay(testPlay);
      myPlayListPage.clickPlay(testPlay);
      const playViewPagePageObject = new PlayViewPagePageObjectCypress();
      playViewPagePageObject.gotoEdit();
      const changedPlay = Play.forge();
      const playFormPageObject = new PlayFormPageObject();
      playFormPageObject.fillIn(changedPlay);
      playFormPageObject.submit();
      const playViewPage = new PlayViewPageObject();
      playViewPage.checkData(changedPlay);
    });
  });
});
