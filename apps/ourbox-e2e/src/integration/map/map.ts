import { HeaderPageObjectCypress } from '@ygg/ourbox/test';
import { GeoPoint, MapView } from '@ygg/shared/geography/core';
import {
  SideDrawerPageObjectCypress,
  PageTitlePageObjectCypress
} from '@ygg/shared/ui/test';

const headerPO = new HeaderPageObjectCypress();
const sideDrawerPO = new SideDrawerPageObjectCypress();
const pageTitlePO = new PageTitlePageObjectCypress();
export const defaultMapView: MapView = {
  center: new GeoPoint({ latitude: 23.6978, longitude: 120.9605 }),
  zoom: 9
};

export function message(id: string, data: any = {}) {
  switch (id) {
    case 'askGeolocationFirstTime':
      return `第一次造訪藏寶地圖嗎？是否要檢視您所在地附近的地圖？`;

    default:
      break;
  }
}

export function gotoMapNavigatorPage() {
  headerPO.openSideDrawer();
  sideDrawerPO.expectVisible();
  sideDrawerPO.clickLink('藏寶地圖');
  pageTitlePO.expectText('藏寶地圖');
}
