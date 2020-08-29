import { PageObject } from '@ygg/shared/test/page-object';

export class PageObjectCypress extends PageObject {
  selectors = {
    main: ''
  };

  expectVisible(
    options: any = {
      timeout: 10000
    }
  ): Cypress.Chainable<any> {
    return cy.get(this.getSelector(), options).should('be.visible');
  }
}
