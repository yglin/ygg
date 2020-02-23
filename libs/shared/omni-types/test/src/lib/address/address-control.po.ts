import { Address } from '@ygg/shared/omni-types/core';
import { AddressControlPageObject } from '@ygg/shared/omni-types/ui';

export class AddressControlPageObjectCypress extends AddressControlPageObject {
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
