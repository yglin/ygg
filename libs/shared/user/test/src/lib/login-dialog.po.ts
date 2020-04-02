import { LoginDialogPageObject } from '@ygg/shared/user/ui';

export class LoginDialogPageObjectCypress extends LoginDialogPageObject {
  expectVisible(): void {
    cy.get(this.getSelector()).should('be.visible');
  }

  expectClosed(cypressOptions: any = {}): void {
    cy.get(this.getSelector(), cypressOptions).should('not.be.visible');
  }

  loginGoogle() {
    cy.get(this.getSelector('buttonGoogle')).click();
  }

  loginFacebook() {
    cy.get(this.getSelector('buttonFacebook')).click();
  }
}
