import { Address } from '@ygg/shared/geography/core';
import { ViewPageObject } from '@ygg/shared/test/page-object';

export class AddressViewPageObjectCypress extends ViewPageObject {
  selectors = {
    main: '.address-view',
    fullAddress: '.full-address'
  };

  expectValue(address: Address) {
    cy.get(this.getSelector('fullAddress')).contains(address.getFullAddress());
  }
}
