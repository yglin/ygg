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
import { range } from 'lodash';
import {
  createTreasure,
  expectMyTreasure,
  expectTreasureInBox,
  gotoCreatePage,
  message,
  setTreasureData
} from './treasure-create';

describe('Create a treasure', () => {
  const me = testUsers[0];
  const treasures = range(10).map(() => Treasure.forge());
  const boxMyDefault = Box.forge();
  boxMyDefault.name = `${me.name}的寶箱`;
  boxMyDefault.album = new Album(Box.thumbnailSrc);

  const boxAllPublic = Box.forge();
  boxAllPublic.name = `所有人的大寶箱`;
  boxAllPublic.album = new Album(Box.thumbnailSrc);

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

  beforeEach(() => {
    gotoCreatePage();
  });

  after(() => {
    theMockDatabase.clear();
  });

  // it('Navigate to creating page from link in side menu', () => {
  //   headerPO.openSideDrawer();
  //   sideDrawerPO.expectVisible();
  //   sideDrawerPO.clickLink('create-treasure');
  //   treasureEditPO.expectVisible();
  //   pageTitlePO.expectText(`新增你的共享寶物`);
  // });

  it('Should request login if not yet', () => {
    const treasure01 = treasures[0];
    setTreasureData(treasure01);
    treasureEditPO.submit();
    emceePO.info(`新增寶物前請先登入帳號`);
    loginTestUser(me, { openLoginDialog: false });
    emceePO.info(message('createSuccess', treasure01.name));
    // Skip putting into box
    emceePO.cancel();
    expectMyTreasure(treasure01);
  });

  it('Should show prompt for putting into box', () => {
    const treasure02 = treasures[1];
    createTreasure(treasure02);
    emceePO.cancel(message('confirmAddToBox', treasure02.name));
    expectMyTreasure(treasure02);
  });

  it('Create and put into my default box', () => {
    const treasure03 = treasures[2];
    createTreasure(treasure03);
    emceePO.confirm(message('confirmAddToBox', treasure03.name));
    const dialogPO = new YggDialogPageObjectCypress();
    const boxSelectorPO = new ImageThumbnailSelectorPageObjectCypress(
      dialogPO.getSelector()
    );
    boxSelectorPO.expectVisible();
    boxSelectorPO.expectItem(boxMyDefault);
    boxSelectorPO.selectItem(boxMyDefault);
    dialogPO.confirm();
    emceePO.info(
      message('putTreasureIntoBox', { treasure: treasure03, box: boxMyDefault })
    );
    expectTreasureInBox(treasure03, boxMyDefault);
  });

  // it('Create and put into all-public box, should show on map', () => {
  //   const treasure04 = treasures[3];
  //   setTreasureData(treasure04);
  //   treasureEditPO.submit();
  //   emceePO.info(message('createSuccess', treasure04.name));
  //   emceePO.confirm(`請選擇一個寶箱來存放 ${treasure04.name}。沒放進寶箱裡的寶物，別人就看不到它了喔～`);
  //   const dialogPO = new YggDialogPageObjectCypress();
  //   const boxSelectorPO = new ImageThumbnailSelectorPageObjectCypress(
  //     dialogPO.getSelector()
  //   );
  //   boxSelectorPO.expectVisible();
  //   boxSelectorPO.expectItem(boxAllPublic);
  //   boxSelectorPO.selectItem(boxAllPublic);
  //   dialogPO.confirm();
  //   emceePO.info(`寶物 ${treasure04.name} 已加入寶箱 ${boxAllPublic.name}`);
  //   expectTreasureOnMap(treasure04);
  // });

  // it('Create a treasure and put it into my default box', () => {
  //   setTreasureData(treasure01);
  // });

  // it('Fill required data', () => {
  // });

  // it('Ask for login before submit', () => {
  // });

  // it('Put it into my default box', () => {
  //   emceePO.confirm(
  //     `請選擇一個寶箱來存放 ${treasure01.name}。沒放進寶箱裡的寶物，別人就看不到它了喔～`
  //   );
  //   const dialogPO = new YggDialogPageObjectCypress();
  //   const boxSelectorPO = new ImageThumbnailSelectorPageObjectCypress(
  //     dialogPO.getSelector()
  //   );
  //   boxSelectorPO.expectVisible();
  //   boxSelectorPO.expectItem(boxMyDefault);
  //   boxSelectorPO.selectItem(boxMyDefault);
  //   dialogPO.confirm();
  //   emceePO.info(`寶物 ${treasure01.name} 已加入寶箱 ${boxMyDefault.name}`);
  // });

  // it('Navigate to the default box, the treasure should be there', () => {
  //   headerPO.openSideDrawer();
  //   sideDrawerPO.expectVisible();
  //   sideDrawerPO.clickLink('my-boxes');
  //   pageTitlePO.expectText('我的寶箱');
  //   myBoxesPO.expectVisible();
  //   myBoxesPO.clickItem(boxMyDefault);
  //   pageTitlePO.expectText(`${boxMyDefault.name}`);
  //   treasuresPO.expectVisible();
  //   treasuresPO.expectItem(treasure01);
  // });

  // it('Navigate to the treasure, check data consistency', () => {
  //   treasuresPO.clickItem(treasure01);
  //   treasureViewPO.expectVisible();
  //   // console.dir(treasure01.album);
  //   treasureViewPO.expectValue(treasure01);
  // });
});
