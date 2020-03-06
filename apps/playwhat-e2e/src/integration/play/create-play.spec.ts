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
  RelationsEditorPageObjectCypress,
  MyThingsPageObjectCypress
} from '@ygg/the-thing/test';
import { ImitationPlay } from '@ygg/playwhat/core';
import { RelationAddition, ImitationProduct } from '@ygg/shopping/core';

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

    // ======= Set values and goto create additions
    theThingEditorPO.extendValue(PlayWithAdditions);
    cy.wrap(SampleAdditions).each((addition: any) => {
      theThingEditorPO.addRelationAndGotoCreate(RelationAddition.name);
      // Addition follows product imitation
      theThingEditorPO.expectValue(ImitationProduct.createTheThing());
      // Expect all required cells should be there
      theThingEditorPO.extendValue(addition);
      theThingEditorPO.submit();
      // Wait until PlayWithAdditions reloaded
      theThingEditorPO.expectNoRelationHint();
      theThingEditorPO.expectValue(PlayWithAdditions);
    });

    theThingEditorPO.submit();
    const playViewPO = new PlayViewPageObjectCypress();
    playViewPO.expectVisible();

    // ======= Go back to my plays page
    siteNavigator.goto(['plays', 'my'], myPlayListPO);

    // ======= Confirm the new play is there
    myPlayListPO.expectPlay(PlayWithAdditions);

    // ======= click it to play view, check data
    myPlayListPO.clickPlay(PlayWithAdditions);
    playViewPO.expectVisible();
    playViewPO.expectValue(PlayWithAdditions);
    playViewPO.expectAdditions(SampleAdditions);

    // ======= Go to the-things page and delete test data
    const myThingsPO = new MyThingsPageObjectCypress();
    siteNavigator.goto(['the-things', 'my'], myThingsPO);
    myThingsPO.deleteThings([PlayWithAdditions, ...SampleAdditions]);
  });
});
