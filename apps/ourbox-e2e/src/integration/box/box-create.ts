import { Box } from '@ygg/ourbox/core';
import {
  BoxCreatePageObjectCypress,
  HeaderPageObjectCypress
} from '@ygg/ourbox/test';
import {
  PageTitlePageObjectCypress,
  SideDrawerPageObjectCypress
} from '@ygg/shared/ui/test';

const headerPO = new HeaderPageObjectCypress();
const sideDrawerPO = new SideDrawerPageObjectCypress();
const pageTitlePO = new PageTitlePageObjectCypress();
const boxCreatePO = new BoxCreatePageObjectCypress();

export function gotoCreatePage() {
  headerPO.openSideDrawer();
  sideDrawerPO.expectVisible();
  sideDrawerPO.clickLink('開新寶箱');
  boxCreatePO.expectVisible();
  pageTitlePO.expectText(`開一個新寶箱`);
}

export function createBox(box: Box) {
  boxCreatePO.expectVisible();
  boxCreatePO.setValue(box);
  boxCreatePO.submit();
}
