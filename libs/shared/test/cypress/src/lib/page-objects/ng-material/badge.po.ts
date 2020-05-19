import { PageObject } from '@ygg/shared/test/page-object';

export class MatBadgePageObjectCypress extends PageObject {
  selectors = {
    main: '.mat-badge'
  };

  expectHide() {
    cy.get(`${this.getSelector()} .mat-badge-content`).should('not.be.visible');
  }

  expectNumber(value: number) {
    cy.get(`${this.getSelector()} .mat-badge-content`).should(
      'have.text',
      value.toString()
    );
  }
}
