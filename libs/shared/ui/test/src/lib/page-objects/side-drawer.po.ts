import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { Page } from '@ygg/shared/ui/core';

export class SideDrawerPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.side-drawer'
  };

  getSelectorForLink(linkName: string): string {
    return `${this.getSelector()} a:contains("${linkName}")`;
  }

  clickLink(linkName: string) {
    cy.get(this.getSelectorForLink(linkName)).click();
  }

  clickAction(actionId: string) {
    cy.get(`${this.getSelector()} [action-id="${actionId}"]`).click();
  }
}
