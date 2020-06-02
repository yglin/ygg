import { ImitationPlay } from '@ygg/playwhat/core';
import {
  PlayViewPageObjectCypress,
  SiteNavigator,
  EquipmentViewPageObjectCypress
} from '@ygg/playwhat/test';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import { ImitationProduct, RelationAddition } from '@ygg/shopping/core';
import {
  MyThingsDataTablePageObjectCypress,
  MyThingsPageObjectCypress,
  TheThingEditorPageObjectCypress
} from '@ygg/the-thing/test';
import { find, values } from 'lodash';
import {
  MinimumPlay,
  PlayFull,
  PlaysWithEquipment,
  SampleEquipments
} from './sample-plays';
import { TheThingCellDefine, TheThingCell } from '@ygg/the-thing/core';

describe('Create play', () => {
  const siteNavigator = new SiteNavigator();
  const myPlayListPO = new MyThingsDataTablePageObjectCypress();
  const playViewPO = new PlayViewPageObjectCypress();
  const equipmentViewPO = new EquipmentViewPageObjectCypress();

  before(() => {
    login().then(user => {});
  });

  beforeEach(() => {
    cy.visit('/');
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
    theMockDatabase.clear();
    theMockDatabase.restoreRTDB();
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

  it('Create a minimum play with all required cells', () => {
    playViewPO.expectFreshNew();
    playViewPO.setValue(MinimumPlay);
    playViewPO.save(MinimumPlay);

    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.theThingDataTablePO.gotoTheThingView(MinimumPlay);
    playViewPO.expectVisible();
    playViewPO.expectValue(MinimumPlay);
  });

  it('Create a play with all fields, required and optional', () => {
    playViewPO.setValue(PlayFull);
    playViewPO.save(PlayFull);

    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.theThingDataTablePO.gotoTheThingView(PlayFull);
    playViewPO.expectVisible();
    playViewPO.expectValue(PlayFull);
  });

  it('Can delete non-required cells', () => {
    const play = MinimumPlay.clone();
    play.name = '測試遊程(刪除資料欄位)';
    const requiredCellNames = ImitationPlay.getRequiredCellNames();
    const additionalCells = ImitationPlay.pickNonRequiredCells(
      values(PlayFull.cells)
    );
    playViewPO.expectFreshNew();
    playViewPO.setValue(play);

    // Required cell does not show delete button
    cy.wrap(requiredCellNames).each((cellName: string) => {
      cy.get(playViewPO.getSelectorForCellDeleteButton(cellName)).should(
        'not.be.visible'
      );
    });

    // Add additional cells
    cy.wrap(additionalCells).each((additionalCell: TheThingCell) => {
      playViewPO.addCell(additionalCell);
    });
    // Delete additional cells
    cy.wrap(additionalCells).each((additionalCell: TheThingCell) => {
      playViewPO.deleteCell(additionalCell);
    });
    playViewPO.save(play);

    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.theThingDataTablePO.gotoTheThingView(play);
    playViewPO.expectVisible();
    playViewPO.expectNoCells(additionalCells);
  });

  it('Create a play with some equipments', () => {
    const play = PlaysWithEquipment[0];
    const equipment1 = SampleEquipments[0];
    const equipment2 = SampleEquipments[1];
    // Show equipments section after all required cells filled
    cy.get(playViewPO.getSelector('equipments')).should('not.be.visible');
    playViewPO.setValue(play);
    playViewPO.gotoCreateEquipment();
    equipmentViewPO.expectVisible();
    equipmentViewPO.setValue(equipment1);
    equipmentViewPO.save(equipment1);
    playViewPO.expectVisible();
    cy.get(playViewPO.getSelector('equipments'))
      .scrollIntoView()
      .should('be.visible');
    playViewPO.expectEquipments([equipment1]);
    playViewPO.gotoCreateEquipment();
    equipmentViewPO.expectVisible();
    equipmentViewPO.setValue(equipment2);
    equipmentViewPO.save(equipment2);
    playViewPO.expectVisible();
    playViewPO.expectEquipments([equipment1, equipment2]);
    playViewPO.save(play);

    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.theThingDataTablePO.gotoTheThingView(play);
    playViewPO.expectVisible();
    playViewPO.expectValue(play);
    playViewPO.expectEquipments([equipment1, equipment2]);
  });
});
