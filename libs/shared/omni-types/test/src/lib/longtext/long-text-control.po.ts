import { LongTextControlPageObject } from '@ygg/shared/omni-types/ui';

export class LongTextControlPageObjectCypress extends LongTextControlPageObject {
  setValue(value: string) {
    cy.get(this.getSelector('inputLongText'))
      .clear()
      .type(value);
  }
}
