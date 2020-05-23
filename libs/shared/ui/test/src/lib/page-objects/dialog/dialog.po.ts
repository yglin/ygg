import { YggDialogPageObject } from '@ygg/shared/ui/widgets';

export class YggDialogPageObjectCypress extends YggDialogPageObject {
  confirm(): void {
    cy.get(this.getSelector('buttonConfirm')).click();
  }

  cancel(): void {
    cy.get(this.getSelector('buttonCancel')).click();
  }

  expectVisible(): void {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  expectClosed(): void {
    cy.get(this.getSelector(), { timeout: 10000 }).should('not.be.visible');
  }
}
