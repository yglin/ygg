import { Box, Treasure } from '@ygg/ourbox/core';
import {
  HeaderPageObjectCypress,
  TreasureEditPageObjectCypress
} from '@ygg/ourbox/test';
import { logout, theMockDatabase } from '@ygg/shared/test/cypress';
import {
  EmceePageObjectCypress,
  ImageThumbnailSelectorPageObjectCypress,
  SideDrawerPageObjectCypress,
  YggDialogPageObjectCypress
} from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import { loginTestUser, testUsers } from '@ygg/shared/user/test';

describe('Create a treasure from the ground up', () => {
  const treasure01 = Treasure.forge();
  // const box01 = Box.forge();
  const headerPO = new HeaderPageObjectCypress();
  const sideDrawerPO = new SideDrawerPageObjectCypress();
  const treasureEditPO = new TreasureEditPageObjectCypress();
  // const boxEditPO = new BoxEditPageObjectCypress();

  const emceePO = new EmceePageObjectCypress();

  const me = testUsers[0];

  before(() => {
    cy.wrap(testUsers).each((user: User) => {
      theMockDatabase.insert(`${User.collection}/${user.id}`, user);
    });
    logout();
    cy.visit('/');
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Navigate to creating page from link in side menu', () => {
    headerPO.openSideDrawer();
    sideDrawerPO.expectVisible();
    sideDrawerPO.clickLink('create-treasure');
    treasureEditPO.expectVisible();
  });

  it('Fill required data', () => {
    treasureEditPO.expectHint('album', '請至少新增一張寶物的照片');
    treasureEditPO.setValue('album', treasure01.album);
    treasureEditPO.nextStep();
    treasureEditPO.setValue('name', treasure01.name);
    treasureEditPO.nextStep();
    // treasureEditPO.expectHint(
    //   'location',
    //   '請設定寶物的所在地，才能顯示在地圖上'
    // );
    treasureEditPO.setValue('location', treasure01.location);
  });

  it('Ask for login before submit', () => {
    treasureEditPO.submit();
    emceePO.info(`新增寶物前請先登入帳號`);
    loginTestUser(me, { openLoginDialog: false });
    emceePO.info(`寶物 ${treasure01.name} 已成功新增`);
  });

  it('Create a default box of user', () => {
    const boxName = `${me.name}的寶箱`;
    emceePO.confirm(
      `請選擇一個寶箱來存放 ${treasure01.name}。未放在寶箱內的寶物預設為公開檢視。`
    );
    const dialogPO = new YggDialogPageObjectCypress();
    const boxSelectorPO = new ImageThumbnailSelectorPageObjectCypress(
      dialogPO.getSelector()
    );
    boxSelectorPO.expectVisible();
    boxSelectorPO.expectItem({
      image: Box.thumbnailSrc,
      name: boxName
    });
    boxSelectorPO.selectItem({ name: boxName });
    dialogPO.confirm();
    emceePO.info(`寶物 ${treasure01.name} 已加入寶箱 ${boxName}`);
  });

  // it('Navigate to the default box, the treasure should be there', () => {});

  // it('Navigate to the treasure, check data consistency', () => {});
});
