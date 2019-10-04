import { PageObject } from '@ygg/shared/test/page-object';
import { Address } from '@ygg/shared/types';

export class AddressControlPageObjectCypress extends PageObject {
  selectors = {
    main: '.address-control',
    rawInput: 'input#raw'
  };

  setValue(address: Address) {
    cy.get(this.getSelector('rawInput')).type(address.getFullAddress());
  }
}