import { login } from '@ygg/shared/test/cypress';
import {
  SiteNavigator,
  MyPlayListPageObjectCypress,
  PlayViewPageObjectCypress
} from '@ygg/playwhat/test';
import {
  MinimumPlay,
  SampleAdditions,
  PlaysWithAddition,
  PlayFull
} from './sample-plays';
import {
  TheThingEditorPageObjectCypress,
  TheThingViewPageObjectCypress,
  RelationsEditorPageObjectCypress,
  MyThingsPageObjectCypress,
  TheThingDataTablePageObjectCypress,
  MyThingsDataTablePageObjectCypress
} from '@ygg/the-thing/test';
import { ImitationPlay } from '@ygg/playwhat/core';
import { RelationAddition, ImitationProduct } from '@ygg/shopping/core';
import { find } from 'lodash';

describe('Create play', () => {
  const siteNavigator = new SiteNavigator();
  const myPlayListPO = new MyThingsDataTablePageObjectCypress();

  before(() => {
    login().then(user => {
      cy.visit('/');
    });
  });

  after(() => {
    // Goto my-things page and delete all test things
    const myThingsPO = new MyThingsPageObjectCypress();
    siteNavigator.goto(['the-things', 'my'], myThingsPO);
    cy.wait(3000);
    myThingsPO.deleteAll();
  });

  it('Create a minimum play from imitation', () => {
    // ======= Go to my plays page
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
    myPlayListPO.theThingDataTablePO.expectTheThing(MinimumPlay);
  });

  it('Create a play with all data fields', () => {
    console.dir(PlayFull);
    siteNavigator.goto(['plays', 'my'], myPlayListPO);

    // ======= Click create button
    myPlayListPO.clickCreate();

    // ======= Redirect to the-thing-editor and automatically apply ImitationPlay
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    theThingEditorPO.setValue(PlayFull);
    theThingEditorPO.submit();

    // ======= Expect play view, check data
    const playViewPO = new PlayViewPageObjectCypress();
    playViewPO.expectVisible();
    playViewPO.expectValue(PlayFull);

    // ======= Go back to my plays page
    siteNavigator.goto(['plays', 'my'], myPlayListPO);

    // ======= Confirm the new play is there
    myPlayListPO.theThingDataTablePO.expectTheThing(PlayFull);
  });

  it('Create a play with some additions', () => {
    const play = PlaysWithAddition[0];
    // ======= Go to my plays page
    siteNavigator.goto(['plays', 'my'], myPlayListPO);

    // ======= Click create button
    myPlayListPO.clickCreate();

    // ======= Redirect to the-thing-editor and automatically apply ImitationPlay
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    theThingEditorPO.expectValue(ImitationPlay.createTheThing());

    // ======= Set values and goto create additions
    theThingEditorPO.extendValue(play);
    const relationAdditions = play.getRelations(RelationAddition.name);
    cy.wrap(relationAdditions).each((relation: any) => {
      const addition = find(SampleAdditions, ad => ad.id === relation.objectId);
      theThingEditorPO.addRelationAndGotoCreate(RelationAddition.name);
      // Addition follows product imitation
      theThingEditorPO.expectValue(ImitationProduct.createTheThing());
      // Expect all required cells should be there
      theThingEditorPO.extendValue(addition);
      theThingEditorPO.submit();
      // Wait until PlaysWithAddition reloaded
      theThingEditorPO.expectNoRelationHint();
      theThingEditorPO.expectValue(play);
    });

    theThingEditorPO.submit();
    const playViewPO = new PlayViewPageObjectCypress();
    playViewPO.expectVisible();

    // ======= Go back to my plays page
    siteNavigator.goto(['plays', 'my'], myPlayListPO);

    // ======= Confirm the new play is there
    myPlayListPO.theThingDataTablePO.expectTheThing(play);

    // ======= click it to play view, check data
    myPlayListPO.theThingDataTablePO.gotoTheThingView(play);
    playViewPO.expectVisible();
    playViewPO.expectValue(play);
    playViewPO.expectAdditions(SampleAdditions);
  });
});
