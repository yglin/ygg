import { Treasure } from '@ygg/ourbox/core';
import {
  HeaderPageObjectCypress,
  TreasureEditPageObjectCypress
} from '@ygg/ourbox/test';
import { OmniTypes } from '@ygg/shared/omni-types/core';
import { SideDrawerPageObjectCypress } from '@ygg/shared/ui/test';

describe('Create a treasure from the ground up', () => {
  const treasure01 = Treasure.forge();
  const headerPO = new HeaderPageObjectCypress();
  const sideDrawerPO = new SideDrawerPageObjectCypress();
  const treasureEditPO = new TreasureEditPageObjectCypress();

  before(() => {
    cy.visit('/');
  });

  it('Navigate to creating page from link in side menu', () => {
    headerPO.openSideDrawer();
    sideDrawerPO.expectVisible();
    sideDrawerPO.clickAction('create-treasure');
    treasureEditPO.expectVisible();
  });

  it('Fill required data', () => {
    treasureEditPO.expectHint('album', '請至少新增一張寶物的照片');
    treasureEditPO.setAlbum(treasure01.album);
    treasureEditPO.nextStep();
    treasureEditPO.expectHint('name', '寶物的名稱是...？');
    treasureEditPO.setName(treasure01.name);
    treasureEditPO.nextStep();
    treasureEditPO.expectHint('location', '請設定寶物的所在地，才能顯示在地圖上');
    treasureEditPO.setLocation(treasure01.location);
  });

  // it('Ask for login before submit', () => {});

  // it('Create a default box of user', () => {});

  // it('Navigate to the default box, the treasure should be there', () => {});

  // it('Navigate to the treasure, check data consistency', () => {});
});
