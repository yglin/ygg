import { PageObject } from '@ygg/shared/test/page-object';
import { Address } from '@ygg/shared/types';

export class AddressViewPageObjectCypress extends PageObject {
  selectors = {
    main: '.address-view',
    fullAddress: '.full-address'
  };

  expectValue(address: Address) {
    cy.get(this.getSelector('fullAddress')).contains(address.getFullAddress());
  }
}