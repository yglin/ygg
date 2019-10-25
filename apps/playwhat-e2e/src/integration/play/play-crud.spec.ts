import { last } from 'lodash';
// import { SerializableJSON } from '@ygg/shared/infra/data-access';
import { login } from '../../page-objects/app.po';
import {
  PlayFormPageObject,
  PlayViewPageObject,
  deletePlay
} from '../../page-objects/play.po';
import { Play } from '@ygg/playwhat/play';
import { SiteNavigator } from '../../page-objects/site-navigator';
import { Tags, Tag } from '@ygg/tags/core';
import { PlayListPageObjectCypress, PlayViewPagePageObjectCypress } from '../../page-objects/play';
import { User } from '@ygg/shared/user';

describe('Play form, new and update play', () => {
  const siteNavigator = new SiteNavigator();
  const testPlays: Play[] = [];

  function createPlay(testPlay: Play, aliasName?: string) {
    testPlays.push(testPlay);
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
      if (aliasName) {
        cy.wrap(testPlay).as(aliasName);
      }
    });
  }

  // before(function() {
  // });

  after(function() {
    cy.wrap(testPlays).each((element, index, array) => {
      // delete temporarily created plays
      cy.log(`Delete test play ${testPlays[index].id}`);
      // @ts-ignore
      cy.callFirestore('delete', `plays/${testPlays[index].id}`);
    });

    // delete tags
    cy.wrap({
      tagsArray: () => {
        let testTags = new Tags();
        for (const play of testPlays) {
          testTags = testTags.merge(play.tags);
        }
        return testTags.toTagsArray();
      }
    })
      .invoke('tagsArray')
      .each((tag: Tag, index: number, array: Tag[]) => {
        cy.log(`Delete test tag ${tag.id}`);
        // @ts-ignore
        cy.callFirestore('delete', `tags/${tag.id}`);
      });
  });

  beforeEach(function() {
    cy.visit('/');
    login();
  });

  it('should create new Play and check data consistency', () => {
    const testPlay = Play.forge();
    createPlay(testPlay);
    const playViewPage = new PlayViewPageObject();
    playViewPage.expectVisible();
    playViewPage.checkData(testPlay);
  });

  it('should show correct creator in play view', () => {
    const testPlay = Play.forge();
    createPlay(testPlay);
    // @ts-ignore
    cy.getCurrentUser().then(firebaseUser => {
      const playViewPage = new PlayViewPageObject();
      const user = User.fromFirebase(firebaseUser);
      playViewPage.expectCreator(user);
    });
  });

  it('should find the created play in my-play-list', () => {
    // const testPlay = Play.forge();
    createPlay(Play.forge(), 'testPlay');
    cy.get('@testPlay').then((testPlay: any) => {
      siteNavigator.goto(['plays', 'my', 'list']);
      const myPlayListPage = new PlayListPageObjectCypress();
      myPlayListPage.expectPlay(testPlay);
      myPlayListPage.clickPlay(testPlay);
      const playViewPage = new PlayViewPageObject();
      playViewPage.checkData(testPlay);
    });
  });

  it('should be able to change play data if user is creator', () => {
    const testPlay = Play.forge();
    createPlay(testPlay);
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
