import { MyBoxesPageObject } from '@ygg/ourbox/ui';

export class MyBoxesPageObjectCypress extends MyBoxesPageObject {
  expectVisible(options: any): Cypress.Chainable<any> {
    return cy.get(this.getSelector(), options).should('be.visible');
  }
}
