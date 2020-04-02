import { UserMenuPageObject } from '@ygg/shared/user/ui';

export class UserMenuPageObjectCypress extends UserMenuPageObject {
  logout(): void {
    cy.get(this.getSelector('menuTrigger'), { timeout: 10000 }).click();
    cy.get('.mat-menu-content button.logout').click();
  }
}
