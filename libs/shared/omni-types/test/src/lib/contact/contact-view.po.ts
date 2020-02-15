import { ContactViewPageObject, Contact } from "@ygg/shared/types";

export class ContactViewPageObjectCypress extends ContactViewPageObject {
  expectValue(value: Contact) {
    cy.get(this.getSelector('name')).contains(value.name);
    cy.get(this.getSelector('phone')).contains(value.phone);
    cy.get(this.getSelector('email')).contains(value.email);
    cy.get(this.getSelector('lineID')).contains(value.lineID);
  }
}