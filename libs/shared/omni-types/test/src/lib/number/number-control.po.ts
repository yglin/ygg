import { NumberControlPageObject } from '@ygg/shared/omni-types/ui';

export class NumberControlPageObjectCypress extends NumberControlPageObject {
  setValue(value: number) {
    cy.get(this.getSelector('numberInput'))
      .should('be.visible')
      .click()
      .clear()
      .should('have.value', '')
      .type(value.toString());
  }
}
