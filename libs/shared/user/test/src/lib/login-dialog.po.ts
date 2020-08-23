import { LoginDialogPageObject } from '@ygg/shared/user/ui';
import { TestAccount } from '@ygg/shared/user/core';

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

  loginTest(account: TestAccount) {
    cy.get(this.getSelector('inputTestAccountEmail'))
      .clear()
      .type(account.email);
    cy.get(this.getSelector('inputTestAccountPassword'))
      .clear()
      .type(account.password);
    cy.get(this.getSelector('buttonLoginTest')).click();
  }
}
