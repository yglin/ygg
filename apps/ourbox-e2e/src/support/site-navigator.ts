import { castArray, isEmpty } from 'lodash';
import {
  HeaderPageObjectCypress,
  BoxCreatePageObjectCypress,
  ItemWarehousePageObjectCypress
} from '@ygg/ourbox/test';
import { SideDrawerPageObjectCypress } from '@ygg/shared/ui/test';
import { pages as OurboxPages } from '@ygg/ourbox/ui';

export class SiteNavigator {
  headerPO = new HeaderPageObjectCypress();
  sideDrawerPO = new SideDrawerPageObjectCypress();

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
}
