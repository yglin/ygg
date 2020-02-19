import { Address } from "@ygg/shared/omni-types/core";
import { AddressControlPageObject } from "@ygg/shared/omni-types/ui";

export class AddressControlPageObjectCypress extends AddressControlPageObject {
  setValue(value: Address) {
    cy.get(this.getSelector('rawInput')).clear().type(value.getFullAddress());
  }
}