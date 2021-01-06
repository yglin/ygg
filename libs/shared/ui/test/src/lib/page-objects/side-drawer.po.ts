import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { Page } from '@ygg/shared/ui/core';

export class SideDrawerPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.side-drawer'
  };

  getSelectorForLink(linkId: string): string {
    return `${this.getSelector()} [link-id="${linkId}"]`;
  }

  clickLink(linkId: string) {
    cy.get(`${this.getSelectorForLink(linkId)} a`).click();
  }

  clickAction(actionId: string) {
    cy.get(`${this.getSelector()} [action-id="${actionId}"]`).click();
  }
}
