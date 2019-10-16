import { ContactControlPageObject, Contact } from "@ygg/shared/types";

export class ContactControlPageObjectCypress extends ContactControlPageObject {

  setValue(contact: Contact) {
    cy.get(this.getSelector('inputName')).clear().type(contact.name || "");
    cy.get(this.getSelector('inputEmail')).clear().type(contact.email || "");
    cy.get(this.getSelector('inputPhone')).clear().type(contact.phone || "");
    cy.get(this.getSelector('inputLineID')).clear().type(contact.lineID || "");
  }
}