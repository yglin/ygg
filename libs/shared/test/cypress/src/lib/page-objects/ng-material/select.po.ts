import { PageObject } from '@ygg/shared/test/page-object';

export class MaterialSelectPageObjectCypress extends PageObject {
  selectors = {
    main: '.mat-select'
  };

  select(label: string) {
    // cy.pause();
    cy.get(`${this.getSelector()} .mat-select-trigger`).click();
    cy.get(`.mat-option:contains("${label}")`).click();
  }
}
