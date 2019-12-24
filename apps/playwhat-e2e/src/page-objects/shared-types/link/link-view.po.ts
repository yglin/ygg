import { LinkViewPageObject } from '@ygg/shared/types';

export class LinkViewPageObjectCypress extends LinkViewPageObject {
  expectValue(link: string) {
    cy.get(this.getSelector('link'))
      .invoke('attr', 'href')
      .should('eq', link);
  }
}
