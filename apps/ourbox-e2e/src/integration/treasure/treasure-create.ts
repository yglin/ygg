import { Box, Treasure } from '@ygg/ourbox/core';
import {
  BoxViewPageObjectCypress,
  HeaderPageObjectCypress,
  TreasureEditPageObjectCypress
} from '@ygg/ourbox/test';
import {
  EmceePageObjectCypress,
  ImageThumbnailListPageObjectCypress,
  ImageThumbnailSelectorPageObjectCypress,
  PageTitlePageObjectCypress,
  SideDrawerPageObjectCypress,
  YggDialogPageObjectCypress
} from '@ygg/shared/ui/test';

const headerPO = new HeaderPageObjectCypress();
const sideDrawerPO = new SideDrawerPageObjectCypress();
const treasureEditPO = new TreasureEditPageObjectCypress();
const treasuresPO = new ImageThumbnailListPageObjectCypress();
const pageTitlePO = new PageTitlePageObjectCypress();
const emceePO = new EmceePageObjectCypress();
const dialogPO = new YggDialogPageObjectCypress();
const boxViewPO = new BoxViewPageObjectCypress();

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

    case 'selectBoxToStoreTreasure':
      return `請選擇一個寶箱來放置 ${data.name}`;

    case 'inputBoxLocation':
      return `請輸入寶箱 ${data.name} 的所在地`;

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

export function addToBox(treasure: Treasure, box: Box) {
  emceePO.confirm(message('confirmAddToBox', treasure.name));
  const boxSelectorPO = new ImageThumbnailSelectorPageObjectCypress(
    dialogPO.getSelector()
  );
  dialogPO.expectTitle(message('selectBoxToStoreTreasure', treasure));
  boxSelectorPO.expectVisible();
  boxSelectorPO.expectItem(box);
  boxSelectorPO.selectItem(box);
  dialogPO.confirm();
  emceePO.info(message('putTreasureIntoBox', { treasure, box }));
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
