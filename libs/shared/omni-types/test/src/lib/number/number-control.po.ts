import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class NumberControlPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.ygg-number-control',
    numberInput: '.number-input input'
  };

  setValue(value: number) {
    cy.get(this.getSelector('numberInput'))
      .should('be.visible')
      .click()
      .clear()
      .should('have.value', '')
      .type(value.toString());
  }
}
