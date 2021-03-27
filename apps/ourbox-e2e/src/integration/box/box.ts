import { Box, Treasure } from '@ygg/ourbox/core';
import { HeaderPageObjectCypress } from '@ygg/ourbox/test';
import {
  ImageThumbnailListPageObjectCypress,
  PageTitlePageObjectCypress,
  SideDrawerPageObjectCypress
} from '@ygg/shared/ui/test';

const headerPO = new HeaderPageObjectCypress();
const sideDrawerPO = new SideDrawerPageObjectCypress();
const myBoxesPO = new ImageThumbnailListPageObjectCypress();
const treasuresPO = new ImageThumbnailListPageObjectCypress();
const pageTitlePO = new PageTitlePageObjectCypress();

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
