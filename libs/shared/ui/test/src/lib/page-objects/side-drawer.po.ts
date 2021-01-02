import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { Page } from '@ygg/shared/ui/core';

export class SideDrawerPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.side-drawer'
  };

  getSelectorForLink(linkId: string): string {
    return `${this.getSelector()} [link-id="${linkId}"]`;
  }

  clickLink(pageId: string) {
    cy.get(`${this.getSelectorForLink(pageId)} a`).click();
  }
}
