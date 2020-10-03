import {
  ImitationEquipment,
  ImitationPlay,
  ImitationPlayCellDefines,
  RelationshipEquipment
} from '@ygg/playwhat/core';
import { SiteNavigator } from '@ygg/playwhat/test';
import { Album } from '@ygg/shared/omni-types/core';
import { theMockDatabase } from '@ygg/shared/test/cypress';
import { User } from '@ygg/shared/user/core';
import { loginTestUser, testUsers } from '@ygg/shared/user/test';
import { TheThingCell, TheThingCellDefine } from '@ygg/the-thing/core';
import {
  MyThingsDataTablePageObjectCypress,
  TheThingPageObjectCypress
} from '@ygg/the-thing/test';
import { values } from 'lodash';
import { beforeAll } from '../../support/before-all';
import {
  MinimumPlay,
  PlayFull,
  PlaysWithEquipment,
  SampleEquipments
} from './sample-plays';

describe('Create play', () => {
  const siteNavigator = new SiteNavigator();
  const myPlayListPO = new MyThingsDataTablePageObjectCypress(
    '',
    ImitationPlay
  );
  const playPO = new TheThingPageObjectCypress('', ImitationPlay);
  const equipPO = new TheThingPageObjectCypress('', ImitationEquipment);
  // const equipPO = new EquipmentViewPageObjectCypress();
  const me: User = testUsers[0];

  before(() => {
    beforeAll();
    cy.visit('/');
    loginTestUser(me);
  });

  beforeEach(() => {
    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.clickCreate();
    playPO.expectVisible();
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Show required cells step-by-step', () => {
    const requiredCellDefs = ImitationPlay.getRequiredCellDefs();
    // Only show the first required cell
    cy.wrap(requiredCellDefs).each(
      (cellDef: TheThingCellDefine, index: number) => {
        if (index === 0) {
          cy.get(playPO.getSelectorForCell(cellDef.id))
            .scrollIntoView()
            .should('be.visible');
        } else {
          cy.get(playPO.getSelectorForCell(cellDef.id)).should(
            'not.be.visible'
          );
        }
      }
    );

    // Filling a required cell will reveal next one
    cy.wrap(requiredCellDefs).each(
      (cellDef: TheThingCellDefine, index: number) => {
        playPO.expectError(
          playPO.getSelectorForCell(cellDef.id),
          `請填入${cellDef.label}資料`
        );
        playPO.setCell(MinimumPlay.getCell(cellDef.id));
        if (index < requiredCellDefs.length - 1) {
          const nextCellDef = requiredCellDefs[index + 1];
          cy.get(playPO.getSelectorForCell(nextCellDef.id))
            .scrollIntoView()
            .should('be.visible');
        }
      }
    );
  });

  it('Show add-cell button only if name set and all required cells filled', () => {
    cy.get(playPO.getSelector('buttonAddCell')).should('not.be.visible');
    const requiredCellDefs = ImitationPlay.getRequiredCellDefs();
    playPO.setName(MinimumPlay.name);
    cy.wrap(requiredCellDefs).each(
      (cellDef: TheThingCellDefine, index: number) => {
        playPO.setCell(MinimumPlay.getCell(cellDef.id));
      }
    );
    cy.get(playPO.getSelector('buttonAddCell')).should('be.visible');
  });

  it('Leave creation and back again should keep inputed data', () => {
    playPO.setValue(MinimumPlay);
    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.clickCreate();
    playPO.expectVisible();
    playPO.expectValue(MinimumPlay);
  });

  it('Save a minimum play with all required cells', () => {
    playPO.setValue(MinimumPlay);
    playPO.save(MinimumPlay);
    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.theThingDataTablePO.gotoTheThingView(MinimumPlay);
    playPO.expectVisible();
    playPO.expectValue(MinimumPlay);
  });

  it('Create a play with all fields, required and optional', () => {
    playPO.setValue(PlayFull);
    playPO.save(PlayFull);

    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.theThingDataTablePO.gotoTheThingView(PlayFull);
    playPO.expectVisible();
    playPO.expectValue(PlayFull);
  });

  it('Can delete non-required cells', () => {
    const play = MinimumPlay.clone();
    play.name = `測試遊程(刪除資料欄位)_${Date.now()}`;
    const requiredCellIds = ImitationPlay.getRequiredCellIds();
    const additionalCells = ImitationPlay.pickNonRequiredCells(
      values(PlayFull.cells)
    );
    playPO.expectFreshNew();
    playPO.setValue(play);

    // Required cell does not show delete button
    cy.wrap(requiredCellIds).each((cellId: string) => {
      cy.get(playPO.getSelectorForCellDeleteButton(cellId)).should(
        'not.be.visible'
      );
    });

    // Add additional cells
    cy.wrap(additionalCells).each((additionalCell: TheThingCell) => {
      playPO.addCell(additionalCell);
    });
    // Delete additional cells
    cy.wrap(additionalCells).each((additionalCell: TheThingCell) => {
      playPO.deleteCell(additionalCell);
    });
    playPO.save(play);

    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.theThingDataTablePO.gotoTheThingView(play);
    playPO.expectVisible();
    playPO.expectNoCells(additionalCells);
  });

  it('Create a play with some equipments', () => {
    const play = PlaysWithEquipment[0];
    const equipment1 = SampleEquipments[0];
    const equipment2 = SampleEquipments[1];
    // Show equipments section after all required cells filled
    cy.get(playPO.getSelectorForRelation(RelationshipEquipment.name)).should(
      'not.be.visible'
    );
    playPO.setValue(play);
    playPO.gotoCreateRelationObject(RelationshipEquipment);
    equipPO.expectVisible();
    equipPO.setValue(equipment1);
    equipPO.save(equipment1);
    playPO.expectVisible();
    cy.get(playPO.getSelectorForRelation(RelationshipEquipment.name))
      .scrollIntoView()
      .should('be.visible');
    playPO.expectRelationObjects(RelationshipEquipment, [equipment1]);
    playPO.gotoCreateRelationObject(RelationshipEquipment);
    equipPO.expectVisible();
    equipPO.setValue(equipment2);
    equipPO.save(equipment2);
    playPO.expectVisible();
    playPO.expectRelationObjects(RelationshipEquipment, [
      equipment1,
      equipment2
    ]);
    playPO.save(play);

    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.theThingDataTablePO.gotoTheThingView(play);
    playPO.expectVisible();
    playPO.expectValue(play);
    playPO.expectRelationObjects(RelationshipEquipment, [
      equipment1,
      equipment2
    ]);
  });

  it('Use album cover as thumbnail image', () => {
    const albumCell = MinimumPlay.getCell(ImitationPlayCellDefines.album.id);
    const album: Album = albumCell.value;
    playPO.expectNoElement('buttonSetImageFromAlbumCover');    
    playPO.setCell(albumCell);
    playPO.setAlbumCoverAsImage(album);
    playPO.expectImage(album.cover.src);
  });

});
