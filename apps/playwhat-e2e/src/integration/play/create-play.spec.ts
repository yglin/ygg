import { ImitationPlay } from '@ygg/playwhat/core';
import { PlayViewPageObjectCypress, SiteNavigator } from '@ygg/playwhat/test';
import { login } from '@ygg/shared/test/cypress';
import { ImitationProduct, RelationAddition } from '@ygg/shopping/core';
import {
  MyThingsDataTablePageObjectCypress,
  MyThingsPageObjectCypress,
  TheThingEditorPageObjectCypress
} from '@ygg/the-thing/test';
import { find } from 'lodash';
import {
  MinimumPlay,
  PlayFull,
  PlaysWithAddition,
  SampleAdditions
} from './sample-plays';
import { TheThingCellDefine } from '@ygg/the-thing/core';

describe('Create play', () => {
  const siteNavigator = new SiteNavigator();
  const myPlayListPO = new MyThingsDataTablePageObjectCypress();
  const playViewPO = new PlayViewPageObjectCypress();

  before(() => {
    login().then(user => {
      cy.visit('/');
    });
  });

  beforeEach(() => {
    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.clickCreate();
    playViewPO.expectVisible();
  });

  after(() => {
    // Goto my-things page and delete all test things
    const myThingsPO = new MyThingsPageObjectCypress();
    siteNavigator.goto(['the-things', 'my'], myThingsPO);
    cy.wait(3000);
    myThingsPO.deleteAll();
  });

  it('Create a minimum', () => {
    playViewPO.expectFreshNew();
    playViewPO.setValue(MinimumPlay);
    playViewPO.save(MinimumPlay);

    // ======= Go back to my plays page
    siteNavigator.goto(['plays', 'my'], myPlayListPO);

    // ======= Confirm the new play is there
    myPlayListPO.theThingDataTablePO.expectTheThing(MinimumPlay);
    myPlayListPO.theThingDataTablePO.gotoTheThingView(MinimumPlay);
    playViewPO.expectVisible();
    playViewPO.expectValue(MinimumPlay);
  });

  it('Show required cells step-by-step', () => {
    const requiredCellDefs = ImitationPlay.getRequiredCellDefs();
    // Only show the first required cell
    cy.wrap(requiredCellDefs).each(
      (cellDef: TheThingCellDefine, index: number) => {
        if (index === 0) {
          cy.get(playViewPO.getSelectorForCell(cellDef.name))
            .scrollIntoView()
            .should('be.visible');
        } else {
          cy.get(playViewPO.getSelectorForCell(cellDef.name)).should(
            'not.be.visible'
          );
        }
      }
    );

    // Filling a required cell will reveal next one
    cy.wrap(requiredCellDefs).each(
      (cellDef: TheThingCellDefine, index: number) => {
        playViewPO.expectError(
          playViewPO.getSelectorForCell(cellDef.name),
          `請填入${cellDef.name}資料`
        );
        playViewPO.setCell(MinimumPlay.getCell(cellDef.name));
        if (index < requiredCellDefs.length - 1) {
          const nextCellDef = requiredCellDefs[index + 1];
          cy.get(playViewPO.getSelectorForCell(nextCellDef.name))
            .scrollIntoView()
            .should('be.visible');
        }
      }
    );
  });

  it('Show add-cell button only if name set and all required cells filled', () => {
    cy.get(playViewPO.getSelector('buttonAddCell')).should('not.be.visible');
    const requiredCellDefs = ImitationPlay.getRequiredCellDefs();
    playViewPO.setName('青菜蝦米碗糕體驗');
    cy.wrap(requiredCellDefs).each(
      (cellDef: TheThingCellDefine, index: number) => {
        playViewPO.setCell(MinimumPlay.getCell(cellDef.name));
      }
    );
    cy.get(playViewPO.getSelector('buttonAddCell')).should('be.visible');
  });

  // it('Create a play with all data fields', () => {
  //   console.dir(PlayFull);
  //   siteNavigator.goto(['plays', 'my'], myPlayListPO);

  //   // ======= Click create button
  //   myPlayListPO.clickCreate();

  //   // ======= Redirect to the-thing-editor and automatically apply ImitationPlay
  //   const theThingEditorPO = new TheThingEditorPageObjectCypress();
  //   theThingEditorPO.expectVisible();
  //   theThingEditorPO.setValue(PlayFull);
  //   theThingEditorPO.submit();

  //   // ======= Expect play view, check data
  //   const playViewPO = new PlayViewPageObjectCypress();
  //   playViewPO.expectVisible();
  //   playViewPO.expectValue(PlayFull);

  //   // ======= Go back to my plays page
  //   siteNavigator.goto(['plays', 'my'], myPlayListPO);

  //   // ======= Confirm the new play is there
  //   myPlayListPO.theThingDataTablePO.expectTheThing(PlayFull);
  // });

  // it('Create a play with some additions', () => {
  //   const play = PlaysWithAddition[0];
  //   // ======= Go to my plays page
  //   siteNavigator.goto(['plays', 'my'], myPlayListPO);

  //   // ======= Click create button
  //   myPlayListPO.clickCreate();

  //   // ======= Redirect to the-thing-editor and automatically apply ImitationPlay
  //   const theThingEditorPO = new TheThingEditorPageObjectCypress();
  //   theThingEditorPO.expectVisible();
  //   theThingEditorPO.expectValue(ImitationPlay.createTheThing());

  //   // ======= Set values and goto create additions
  //   theThingEditorPO.extendValue(play);
  //   const relationAdditions = play.getRelations(RelationAddition.name);
  //   cy.wrap(relationAdditions).each((relation: any) => {
  //     const addition = find(SampleAdditions, ad => ad.id === relation.objectId);
  //     theThingEditorPO.addRelationAndGotoCreate(RelationAddition.name);
  //     // Addition follows product imitation
  //     theThingEditorPO.expectValue(ImitationProduct.createTheThing());
  //     // Expect all required cells should be there
  //     theThingEditorPO.extendValue(addition);
  //     theThingEditorPO.submit();
  //     // Wait until PlaysWithAddition reloaded
  //     theThingEditorPO.expectNoRelationHint();
  //     theThingEditorPO.expectValue(play);
  //   });

  //   theThingEditorPO.submit();
  //   const playViewPO = new PlayViewPageObjectCypress();
  //   playViewPO.expectVisible();

  //   // ======= Go back to my plays page
  //   siteNavigator.goto(['plays', 'my'], myPlayListPO);

  //   // ======= Confirm the new play is there
  //   myPlayListPO.theThingDataTablePO.expectTheThing(play);

  //   // ======= click it to play view, check data
  //   myPlayListPO.theThingDataTablePO.gotoTheThingView(play);
  //   playViewPO.expectVisible();
  //   playViewPO.expectValue(play);
  //   playViewPO.expectAdditions(SampleAdditions);
  // });
});
