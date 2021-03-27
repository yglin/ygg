import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class YggDialogPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.ygg-dialog.active',
    title: '.title',
    buttonConfirm: 'button.confirm',
    buttonCancel: 'button.cancel'
  };

  confirm(): void {
    cy.get(this.getSelector('buttonConfirm')).click();
  }

  cancel(): void {
    cy.get(this.getSelector('buttonCancel')).click();
  }

  // expectVisible(): void {
  //   cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  // }

  expectClosed(): void {
    cy.get(this.getSelector(), { timeout: 10000 }).should('not.exist');
  }

  expectTitle(title: string) {
    cy.get(this.getSelector('title')).contains(title);
  }
}
