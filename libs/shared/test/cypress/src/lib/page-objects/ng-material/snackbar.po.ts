import { PageObject } from '@ygg/shared/test/page-object';

export class MaterialSnackBarPageObjectCypress extends PageObject {
  expectMessage(message: string) {
    cy.get('.mat-snack-bar-container').should('include.text', message);
  }
}
