import { AccountWidgetPageObject } from '@ygg/shared/user/ui';
import { UserMenuPageObjectCypress } from './user-menu.po';

export class AccountWidgetPageObjectCypress extends AccountWidgetPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.userMenuPO = new UserMenuPageObjectCypress(this.getSelector());
  }

  login(): void {
    cy.get(this.getSelector('buttonLogin')).click();
  }

  expectLoggedIn(): Cypress.Chainable<any> {
    return cy
      .get(this.getSelector('loggedInWidget'), { timeout: 20000 })
      .should('exist');
  }

  expectLoggedOut(): Cypress.Chainable<any> {
    return cy
      .get(this.getSelector('loggedOutWidget'), { timeout: 10000 })
      .should('be.visible');
  }

  expectNotification(countUnread: number) {
    cy.get(this.getSelector('buttonNotification')).should(
      'include.text',
      countUnread.toString()
    );
  }

  expectNotificationHidden() {
    cy.get(this.getSelector('buttonNotification')).should('not.be.visible');
  }

  clickNotification() {
    cy.get(this.getSelector('buttonNotification')).click();
  }
}
