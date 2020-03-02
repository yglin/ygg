import { login } from "@ygg/shared/test/cypress";
import { SiteNavigator, MyPlayListPageObjectCypress, PlayViewPageObjectCypress } from '@ygg/playwhat/test';
import { MinimumPlay } from "./sample-plays";
import { TheThingEditorPageObjectCypress, TheThingViewPageObjectCypress } from '@ygg/the-thing/test';
import { ImitationPlay } from '@ygg/playwhat/core';

describe('Create play', () => {
  const siteNavigator = new SiteNavigator();

  before(() => {
    login().then(user => {
      cy.visit('/');
    });
  });

  it('Create a minimum play from template', () => {
    // ======= Go to my plays page
    const myPlayListPO = new MyPlayListPageObjectCypress();
    siteNavigator.goto(['plays','my'], myPlayListPO);

    // ======= Click create button
    myPlayListPO.clickCreate();

    // ======= Redirect to the-thing-editor and automatically apply ImitationPlay
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    theThingEditorPO.expectValue(ImitationPlay.createTheThing());

    // ======= Submit new play
    theThingEditorPO.setValue(MinimumPlay);
    theThingEditorPO.submit();

    // ======= Expect play view, check data
    const playViewPO = new PlayViewPageObjectCypress();
    playViewPO.expectVisible();
    playViewPO.expectValue(MinimumPlay);

    // ======= Go back to my plays page
    siteNavigator.goto(['plays', 'my'], myPlayListPO);

    // ======= Confirm the new play is there
    myPlayListPO.expectPlay(MinimumPlay);

    // ======= Delete it
    myPlayListPO.deletePlay(MinimumPlay);
    myPlayListPO.expectNotPlay(MinimumPlay);
  });
});
