import { UserMenuPageObject } from '@ygg/shared/user/ui';

export class UserMenuPageObjectCypress extends UserMenuPageObject {
  open(): void {
    cy.get(this.getSelector('menuTrigger')).click();
  }

  clickMenuItem(itemId: string): void {
    cy.get(`.mat-menu-content [menu-item-id="${itemId}"]`).click();
  }

  logout(): void {
    cy.get(this.getSelector('menuTrigger'), { timeout: 10000 }).click();
    cy.get('.mat-menu-content button.logout').click();
  }
}
