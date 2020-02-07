import { ImitationEditorPageObject } from '@ygg/the-thing/ui';
import { TheThingImitation, TheThing } from '@ygg/the-thing/core';
import { TheThingFinderPageObjectCypress } from '../the-thing';

export class ImitationEditorPageObjectCypress extends ImitationEditorPageObject {
  theThingFinderPO: TheThingFinderPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.theThingFinderPO = new TheThingFinderPageObjectCypress(
      this.getSelector()
    );
  }

  expectVisible(flag: boolean = true) {
    if (flag) {
      cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
    } else {
      cy.get(this.getSelector(), { timeout: 10000 }).should('not.be.visible');
    }
  }

  setValue(imitation: TheThingImitation, template: TheThing) {
    cy.get(this.getSelector('tab1Header')).click();
    this.theThingFinderPO.select(template);
    cy.get(this.getSelector('tab2Header')).click();
    cy.get(this.getSelector('inputName'))
      .clear()
      .type(imitation.name);
    cy.get(this.getSelector('textareaDescription'))
      .clear()
      .type(imitation.description);
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click({ force: true });
  }
}
