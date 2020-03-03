import { login } from '@ygg/shared/test/cypress';
import {
  SiteNavigator,
  MyPlayListPageObjectCypress,
  PlayViewPageObjectCypress
} from '@ygg/playwhat/test';
import {
  MinimumPlay,
  SampleAdditions,
  PlayWithAdditions
} from './sample-plays';
import {
  TheThingEditorPageObjectCypress,
  TheThingViewPageObjectCypress,
  RelationsEditorPageObjectCypress
} from '@ygg/the-thing/test';
import { ImitationPlay } from '@ygg/playwhat/core';
import { RelationAddition } from '@ygg/shopping/core';

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
    siteNavigator.goto(['plays', 'my'], myPlayListPO);

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

  it('Create a play with some additions', () => {
    // ======= Go to my plays page
    const myPlayListPO = new MyPlayListPageObjectCypress();
    siteNavigator.goto(['plays', 'my'], myPlayListPO);

    // ======= Click create button
    myPlayListPO.clickCreate();

    // ======= Redirect to the-thing-editor and automatically apply ImitationPlay
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    theThingEditorPO.expectValue(ImitationPlay.createTheThing());

    // ======= Set values and create additions
    theThingEditorPO.setValue(PlayWithAdditions);
    const relationsEditorPO = new RelationsEditorPageObjectCypress(
      this.getSelectorForRelationsEditor(RelationAddition)
    );
    relationsEditorPO.expectVisible();
    relationsEditorPO.expectRelationToSubject(RelationAddition, PlayWithAdditions);
    cy.wrap(SampleAdditions).each((addition: any) => {
      relationsEditorPO.gotoCreateRelationObject();
      // Refresh page, for creating addition
      theThingEditorPO.setValue(addition);
      theThingEditorPO.submit();
      // Back to creating play, expect the new relation to addition
      relationsEditorPO.expectObject(addition);
    });
    theThingEditorPO.submit();

    // ======= Expect play view, check data
    const playViewPO = new PlayViewPageObjectCypress();
    playViewPO.expectVisible();
    playViewPO.expectValue(PlayWithAdditions);
    playViewPO.expectAdditions(SampleAdditions);

    // ======= Go back to my plays page
    siteNavigator.goto(['plays', 'my'], myPlayListPO);

    // ======= Confirm the new play is there
    myPlayListPO.expectPlay(PlayWithAdditions);

    // ======= Delete it
    myPlayListPO.deletePlay(PlayWithAdditions);
    myPlayListPO.expectNotPlay(PlayWithAdditions);
  });
});
