import { TextControlPageObject } from '@ygg/shared/omni-types/ui';

export class TextControlPageObjectCypress extends TextControlPageObject {
  setValue(value: string) {
    cy.get(this.getSelector('inputText'))
      .clear()
      .type(value);
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click();
  }
}
