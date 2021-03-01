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
import { MapPageObjectCypress } from '@ygg/shared/geography/test';

const headerPO = new HeaderPageObjectCypress();
const sideDrawerPO = new SideDrawerPageObjectCypress();
const treasureEditPO = new TreasureEditPageObjectCypress();
const myBoxesPO = new ImageThumbnailListPageObjectCypress();
const treasuresPO = new ImageThumbnailListPageObjectCypress();
const pageTitlePO = new PageTitlePageObjectCypress();
const treasureViewPO = new TreasureViewPageObjectCypress();
const emceePO = new EmceePageObjectCypress();
const mapPO = new MapPageObjectCypress();

export function gotoCreatePage() {
  headerPO.openSideDrawer();
  sideDrawerPO.expectVisible();
  sideDrawerPO.clickLink('分享寶物');
  treasureEditPO.expectVisible();
  pageTitlePO.expectText(`分享我的寶物`);
}

export function gotoMyTreasures() {
  headerPO.openSideDrawer();
  sideDrawerPO.expectVisible();
  sideDrawerPO.clickLink('我的寶物');
  treasuresPO.expectVisible();
  pageTitlePO.expectText(`我的寶物`);
}
export function message(id: string, data: any) {
  switch (id) {
    case 'confirmAddToBox':
      return `請選擇一個寶箱來存放 ${data}。沒放進寶箱裡的寶物，別人就找不到它了喔～`;

    case 'createSuccess':
      return `成功新增寶物 ${data} ！`;

    case 'putTreasureIntoBox':
      return `寶物 ${data.treasure.name} 已加入寶箱 ${data.box.name}`;

    case 'boxShouldHaveLocation':
      return `寶箱 ${data.box.name} 還沒有設定地點，在地圖上會找不到，現在設定地點？`;

    default:
      return '';
  }
}

export function setTreasureData(treasure: Treasure) {
  // treasureEditPO.expectHint('album', '請至少新增一張寶物的照片');
  // console.dir(treasure01.album);
  treasureEditPO.expectStep('寶物的照片');
  treasureEditPO.setValue('album', treasure.album);
  // cy.pause();
  treasureEditPO.nextStep();
  treasureEditPO.expectStep('寶物的名稱');
  treasureEditPO.setValue('name', treasure.name);
  // treasureEditPO.nextStep();
  // treasureEditPO.setValue('location', treasure.location);
}

export function createTreasure(treasure: Treasure) {
  gotoCreatePage();
  setTreasureData(treasure);
  treasureEditPO.submit();
  emceePO.info(message('createSuccess', treasure.name));
}

export function expectMyTreasure(treasure: Treasure) {
  gotoMyTreasures();
  treasuresPO.expectVisible();
  treasuresPO.expectItem(treasure);
}

export function gotoMyBoxes() {
  headerPO.openSideDrawer();
  sideDrawerPO.expectVisible();
  sideDrawerPO.clickLink('我的寶箱');
  pageTitlePO.expectText('我的寶箱');
  myBoxesPO.expectVisible();
}

export function expectTreasureInBox(treasure: Treasure, box: Box) {
  gotoMyBoxes();
  myBoxesPO.clickItem(box);
  pageTitlePO.expectText(`${box.name}`);
  treasuresPO.expectVisible();
  treasuresPO.expectItem(treasure);
}

export function gotoMap() {
  headerPO.openSideDrawer();
  sideDrawerPO.expectVisible();
  sideDrawerPO.clickLink('藏寶圖');
  pageTitlePO.expectText('藏寶圖');
}

// export function expectTreasureOnMap(treasure: Treasure) {
//   gotoMap();
//   mapPO.locateItem(treasure);
// }
