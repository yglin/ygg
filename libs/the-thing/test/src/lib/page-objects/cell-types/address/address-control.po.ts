import { Address, AddressControlPageObject } from "@ygg/shared/types";

export class AddressControlPageObjectCypress extends AddressControlPageObject {
  setValue(value: Address) {
    cy.get(this.getSelector('rawInput')).clear().type(value.getFullAddress());
  }
}