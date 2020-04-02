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

  expectLoggedIn(): void {
    cy.get(this.getSelector('loggedInWidget'), { timeout: 10000 }).should(
      'be.visible'
    );
  }

  expectLoggedOut(): void {
    cy.get(this.getSelector('loggedOutWidget'), { timeout: 10000 }).should(
      'be.visible'
    );
  }
}
