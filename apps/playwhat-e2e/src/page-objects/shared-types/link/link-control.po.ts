import { LinkControlPageObject } from "@ygg/shared/types";

export class LinkControlPageObjectCypress extends LinkControlPageObject {
  setValue(value: string) {
    cy.get(this.getSelector('inputLink')).clear().type(value);
  }
}