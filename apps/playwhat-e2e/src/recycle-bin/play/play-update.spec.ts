import { Play } from '@ygg/playwhat/play';
import { MockDatabase, Document } from '../../support/mock-database';
import { login } from '../../page-objects/app.po';
import { SiteNavigator } from '../../page-objects/site-navigator';
import {
  PlayListPageObjectCypress,
  PlayViewPagePageObjectCypress
} from '../../page-objects/play';
import {
  PlayFormPageObject,
  PlayViewPageObject
} from '../../page-objects/play.po';
import { Addition } from '@ygg/resource/core';

describe('Update Play', () => {
  const siteNavigator = new SiteNavigator();
  const mockDatabase = new MockDatabase();
  let testPlay: Play;
  let changeData: Play;

  before(() => {
    cy.visit('/');
    login().then((user: any) => {
      const documents: Document[] = [];
      
      testPlay = Play.forge({
        numAdditions: 3
      });
      testPlay.creatorId = user.id;
      documents.push({
        path: `plays/${testPlay.id}`,
        data: testPlay.toJSON()
      });
      testPlay.additions.forEach(addition => documents.push({
        path: `${Addition.collection}/${addition.id}`,
        data: addition.toJSON()
      }));
      
      changeData = Play.forge({
        numAdditions: 4
      });
      changeData.additions.forEach(addition => documents.push({
        path: `${Addition.collection}/${addition.id}`,
        data: addition.toJSON()
      }));

      mockDatabase.insertDocuments(documents);
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
      const playFormPageObject = new PlayFormPageObject();
      playFormPageObject.fillIn(changeData);
      playFormPageObject.submit();
      cy.url({timeout: 10000}).should('not.include', 'edit');
      const playViewPage = new PlayViewPageObject();
      playViewPage.checkData(changeData);
    });
  });
});