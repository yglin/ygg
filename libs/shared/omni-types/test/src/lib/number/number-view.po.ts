import { NumberViewPageObject } from '@ygg/shared/omni-types/ui';

export class NumberViewPageObjectCypress extends NumberViewPageObject {
  expectValue(value: number): void {
    cy.get(this.getSelector('value')).should('have.text', value.toString());
  }
}
