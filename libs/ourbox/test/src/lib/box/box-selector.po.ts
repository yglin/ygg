import { Box } from '@ygg/ourbox/core';
import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class BoxSelectorPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.box-selector',
    buttonCreateBox: 'button.create-box'
  };

  getSelectorForBox(boxName: string): string {
    return `${this.getSelector()} .box:contains("${boxName}")`;
  }

  expectCountBoxes(count: number) {
    cy.get(`${this.getSelector()} .box`).its('length');
  }

  selectDefaultBox(userName: string) {
    cy.get(this.getSelectorForBox(`${userName}的寶箱`)).click();
  }

  createBox() {
    cy.get(this.getSelector('buttonCreateBox')).click();
  }

  selectBox(boxName: string) {
    cy.get(this.getSelectorForBox(boxName)).click();
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click();
  }
}
