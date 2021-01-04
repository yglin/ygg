import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { Page } from '@ygg/shared/ui/core';

export class SideDrawerPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.side-drawer'
  };

  getSelectorForLink(link: Page): string {
    return `${this.getSelector()} [link-id="${link.id}"]`;
  }

  clickLink(page: Page) {
    cy.get(`${this.getSelectorForLink(page)} a`).click();
  }
}
