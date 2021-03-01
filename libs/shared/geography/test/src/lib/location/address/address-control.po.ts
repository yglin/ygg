import { Address } from '@ygg/shared/geography/core';
import { ControlPageObject } from '@ygg/shared/test/page-object';

export class AddressControlPageObjectCypress extends ControlPageObject {
  selectors = {
    main: '.address-control',
    rawInput: 'input.raw'
  }

  expectValue(value: Address) {
    cy.get(this.getSelector('rawInput'))
      .invoke('val')
      .should('equal', value.getFullAddress());
  }
  setValue(value: Address) {
    cy.get(this.getSelector('rawInput'))
      .clear()
      .type(value.getFullAddress());
  }
}
