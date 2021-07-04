import { PageObject } from '@ygg/shared/test/page-object';

// Ref. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export class MaterialSelectPageObjectCypress extends PageObject {
  selectors = {
    main: '.mat-select'
  };

  select(label: string) {
    // cy.pause();
    cy.get(`${this.getSelector()} .mat-select-trigger`).click();

    const regexp = new RegExp(`^\\s*${escapeRegExp(label)}\\s*$`, 'g');
    cy.get('.mat-option')
      .contains(regexp)
      .click();
  }

  selectByValue(value: any) {
    cy.get(`${this.getSelector()} .mat-select-trigger`).click();
    cy.get(`.mat-option[ng-reflect-value="${value}"]`).click();
  }

  expectSelected(label: string) {
    cy.get(`${this.getSelector()} .mat-select-value`).should(
      'include.text',
      label
    );
  }
}
