import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class HeaderPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.header',
    buttonOpenSideDrawer: 'button.open-side-drawer'
  };

  openSideDrawer() {
    cy.get(this.getSelector('buttonOpenSideDrawer')).click();
  }
}
