import { Contact } from '@ygg/shared/omni-types/core';
import { ContactControlPageObject } from '@ygg/shared/omni-types/ui';
import { get, capitalize } from 'lodash';

export class ContactControlPageObjectCypress extends ContactControlPageObject {
  importFromUser() {
    cy.get(this.getSelector('buttonImportFromUser')).click();
  }

  setValue(contact: Contact) {
    cy.get(this.getSelector('inputName'))
      .clear()
      .type(contact.name || '');
    cy.get(this.getSelector('inputEmail'))
      .clear()
      .type(contact.email || '');
    cy.get(this.getSelector('inputPhone'))
      .clear()
      .type(contact.phone || '');
    cy.get(this.getSelector('inputLineID'))
      .clear()
      .type(contact.lineID || '');
  }

  expectValue(contact: Contact): void {
    cy.get(this.getSelector('inputName'))
      .invoke('val')
      .should('equal', contact.name);
    cy.wrap(['email', 'phone', 'lineID']).each((key: any) => {
      const value = get(contact, key, null);
      const inputName = `input${key === 'lineID' ? 'LineID' : capitalize(key)}`;
      if (value) {
        cy.get(this.getSelector(inputName))
          .invoke('val')
          .should('equal', value);
      }
    });
  }
}
