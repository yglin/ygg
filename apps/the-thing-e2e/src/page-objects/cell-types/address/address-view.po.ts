import { Address, AddressViewPageObject } from "@ygg/shared/types";

export class AddressViewPageObjectCypress extends AddressViewPageObject {
  expectValue(value: Address) {
    cy.get(this.getSelector('fullAddress')).contains(value.getFullAddress());
  }
}