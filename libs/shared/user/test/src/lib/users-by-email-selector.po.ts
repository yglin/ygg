import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class UsersByEmailSelectorPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.users-by-email-selector',
    inputEmail: '.user-email-finder input[type="email"]',
    buttonAddEmail: '.user-email-finder button.add'
  };

  addEmail(email: string) {
    cy.get(this.getSelector('inputEmail'))
      .clear()
      .type(email);
    cy.get(this.getSelector('buttonAddEmail')).click();
  }
}
