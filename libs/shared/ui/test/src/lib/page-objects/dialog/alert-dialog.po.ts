import { AlertDialogPageObject } from '@ygg/shared/ui/widgets';

export class AlertDialogPageObjectCypress extends AlertDialogPageObject {
  expectClosed() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('not.be.visible');
  }

  expectMessage(message: string) {
    cy.get(this.getSelector('content')).should('have.text', message);
  }

  // confirm(): void {
  //   cy.get(this.getSelector('buttonConfirm')).click();
  //   cy.get(this.getSelector()).should('not.be.visible');
  // }
}
