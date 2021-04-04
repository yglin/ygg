import { HeaderPageObjectCypress } from '@ygg/ourbox/test';
import {
  SideDrawerPageObjectCypress,
  PageTitlePageObjectCypress
} from '@ygg/shared/ui/test';

const headerPO = new HeaderPageObjectCypress();
const sideDrawerPO = new SideDrawerPageObjectCypress();
const pageTitlePO = new PageTitlePageObjectCypress();

export function gotoMapNavigatorPage() {
  headerPO.openSideDrawer();
  sideDrawerPO.expectVisible();
  sideDrawerPO.clickLink('藏寶地圖');
  pageTitlePO.expectText('藏寶地圖');
}
