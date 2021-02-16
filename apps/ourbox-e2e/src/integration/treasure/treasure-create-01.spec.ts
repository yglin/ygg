import { Box, Treasure } from '@ygg/ourbox/core';
import {
  HeaderPageObjectCypress,
  TreasureEditPageObjectCypress,
  TreasureViewPageObjectCypress
} from '@ygg/ourbox/test';
import { Album } from '@ygg/shared/omni-types/core';
import { logout, theMockDatabase } from '@ygg/shared/test/cypress';
import {
  EmceePageObjectCypress,
  ImageThumbnailListPageObjectCypress,
  ImageThumbnailSelectorPageObjectCypress,
  PageTitlePageObjectCypress,
  SideDrawerPageObjectCypress,
  YggDialogPageObjectCypress
} from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import { loginTestUser, testUsers } from '@ygg/shared/user/test';

describe('Create a treasure and put it into my default box', () => {
  const me = testUsers[0];
  const treasure01 = Treasure.forge();
  const boxDefault = Box.forge();
  boxDefault.name = `${me.name}的寶箱`;
  boxDefault.album = new Album(Box.thumbnailSrc);

  // const box01 = Box.forge();
  const headerPO = new HeaderPageObjectCypress();
  const sideDrawerPO = new SideDrawerPageObjectCypress();
  const treasureEditPO = new TreasureEditPageObjectCypress();
  const myBoxesPO = new ImageThumbnailListPageObjectCypress();
  const treasuresPO = new ImageThumbnailListPageObjectCypress();
  const pageTitlePO = new PageTitlePageObjectCypress();
  const treasureViewPO = new TreasureViewPageObjectCypress();
  // const boxEditPO = new BoxEditPageObjectCypress();

  const emceePO = new EmceePageObjectCypress();

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
    pageTitlePO.expectText(`新增你的共享寶物`);
  });

  it('Fill required data', () => {
    treasureEditPO.expectHint('album', '請至少新增一張寶物的照片');
    // console.dir(treasure01.album);
    treasureEditPO.setValue('album', treasure01.album);
    // cy.pause();
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
    emceePO.info(`成功新增寶物 ${treasure01.name} ！`);
  });

  it('Put it into my default box', () => {
    emceePO.confirm(
      `請選擇一個寶箱來存放 ${treasure01.name}。沒放進寶箱裡的寶物，別人就看不到它了喔～`
    );
    const dialogPO = new YggDialogPageObjectCypress();
    const boxSelectorPO = new ImageThumbnailSelectorPageObjectCypress(
      dialogPO.getSelector()
    );
    boxSelectorPO.expectVisible();
    boxSelectorPO.expectItem(boxDefault);
    boxSelectorPO.selectItem(boxDefault);
    dialogPO.confirm();
    emceePO.info(`寶物 ${treasure01.name} 已加入寶箱 ${boxDefault.name}`);
  });

  it('Navigate to the default box, the treasure should be there', () => {
    headerPO.openSideDrawer();
    sideDrawerPO.expectVisible();
    sideDrawerPO.clickLink('my-boxes');
    pageTitlePO.expectText('我的寶箱');
    myBoxesPO.expectVisible();
    myBoxesPO.clickItem(boxDefault);
    pageTitlePO.expectText(`${boxDefault.name}`);
    treasuresPO.expectVisible();
    treasuresPO.expectItem(treasure01);
  });

  it('Navigate to the treasure, check data consistency', () => {
    treasuresPO.clickItem(treasure01);
    treasureViewPO.expectVisible();
    // console.dir(treasure01.album);
    treasureViewPO.expectValue(treasure01);
  });
});
