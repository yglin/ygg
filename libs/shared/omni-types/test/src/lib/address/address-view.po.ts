import { Address } from "@ygg/shared/omni-types/core";
import { AddressViewPageObject } from "@ygg/shared/omni-types/ui";

export class AddressViewPageObjectCypress extends AddressViewPageObject {
  expectValue(value: Address) {
    cy.get(this.getSelector('fullAddress')).contains(value.getFullAddress());
  }
}