import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class MatCheckboxPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.mat-checkbox'
  };

  check() {
    cy.get(`${this.getSelector()} label`).click();
  }
}
