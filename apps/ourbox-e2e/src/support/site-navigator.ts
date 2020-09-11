import { castArray, isEmpty } from 'lodash';
import {
  HeaderPageObjectCypress,
  BoxCreatePageObjectCypress,
  ItemWarehousePageObjectCypress,
  MapSearchPageObjectCypress, SiteHowtoPageObjectCypress
} from '@ygg/ourbox/test';
import { SideDrawerPageObjectCypress } from '@ygg/shared/ui/test';
import { pages as OurboxPages } from '@ygg/ourbox/core';
import { AccountWidgetPageObjectCypress } from '@ygg/shared/user/test';

export class SiteNavigator {
  headerPO = new HeaderPageObjectCypress();
  sideDrawerPO = new SideDrawerPageObjectCypress();
  accountWidgetPO = new AccountWidgetPageObjectCypress();

  goto(paths: string[] | string) {
    paths = castArray(paths);
    if (isEmpty(paths)) {
      throw Error(`SiteNavigator.goto(): No path specified, ${paths}`);
    }
    switch (paths[0]) {
      case 'home':
        this.gotoHome();
        break;

      default:
        break;
    }
  }

  gotoHome() {
    cy.get('.header .home').click();
  }

  gotoSiteHowto() {
    this.headerPO.openSideDrawer();
    this.sideDrawerPO.expectVisible();
    this.sideDrawerPO.clickLink(OurboxPages.siteHowto);
    const siteHowtoPO = new SiteHowtoPageObjectCypress();
    siteHowtoPO.expectVisible();
  }

  gotoBoxCreatePage() {
    this.headerPO.openSideDrawer();
    this.sideDrawerPO.expectVisible();
    this.sideDrawerPO.clickLink(OurboxPages.boxCreate);
    const boxCreatePO = new BoxCreatePageObjectCypress();
    boxCreatePO.expectVisible();
  }

  gotoItemWarehouse() {
    this.headerPO.openSideDrawer();
    this.sideDrawerPO.expectVisible();
    this.sideDrawerPO.clickLink(OurboxPages.itemWarehouse);
    const itemWarehousePO = new ItemWarehousePageObjectCypress();
    itemWarehousePO.expectVisible();
  }

  gotoMapSearch() {
    this.headerPO.openSideDrawer();
    this.sideDrawerPO.expectVisible();
    this.sideDrawerPO.clickLink(OurboxPages.mapSearch);
    const mapSearchPO = new MapSearchPageObjectCypress();
    mapSearchPO.expectVisible();
  }

  gotoMyBoxes() {
    this.accountWidgetPO.openUserMenu();
    this.accountWidgetPO.userMenuPO.clickMenuItem('myBoxes');
  }

  gotoMyHeldItems() {
    this.accountWidgetPO.openUserMenu();
    this.accountWidgetPO.userMenuPO.clickMenuItem('myHeldItems');
  }

  gotoMyItemTransfers() {
    this.accountWidgetPO.openUserMenu();
    this.accountWidgetPO.userMenuPO.clickMenuItem('myItemTransfers');
  }
}
