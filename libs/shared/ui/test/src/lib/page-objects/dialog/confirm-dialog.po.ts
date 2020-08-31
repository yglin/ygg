import { ConfirmDialogPageObject } from '@ygg/shared/ui/widgets';

export class ConfirmDialogPageObjectCypress extends ConfirmDialogPageObject {
  expectMessage(message: string) {
    cy.get(this.getSelector('content'), { timeout: 10000 }).should(
      'have.text',
      message
    );
  }

  expectClosed() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('not.be.visible');
  }

  // confirm(): void {
  //   cy.get(this.getSelector('buttonConfirm')).click();
  //   // cy.get(this.getSelector()).should('not.be.visible');
  // }

  // cancel(): void {
  //   cy.get(this.getSelector('buttonCancel')).click();
  //   // cy.get(this.getSelector()).should('not.be.visible');
  // }
}
