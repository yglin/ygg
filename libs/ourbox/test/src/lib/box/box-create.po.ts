import { BoxCreatePageObject } from '@ygg/ourbox/ui';

export class BoxCreatePageObjectCypress extends BoxCreatePageObject {
  expectVisible(options: any) {
    cy.get(this.getSelector(), options).should('be.visible');
  }
}
