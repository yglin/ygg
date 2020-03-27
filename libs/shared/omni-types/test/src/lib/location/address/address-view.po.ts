import { Address } from '@ygg/shared/omni-types/core';
import { AddressViewPageObject } from '@ygg/shared/omni-types/ui';

export class AddressViewPageObjectCypress extends AddressViewPageObject {
  expectValue(address: Address) {
    cy.get(this.getSelector('fullAddress')).contains(address.getFullAddress());
  }
}
