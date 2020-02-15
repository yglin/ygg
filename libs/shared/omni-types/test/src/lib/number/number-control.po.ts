import { NumberControlPageObject } from '@ygg/shared/omni-types/ui';

export class NumberControlPageObjectCypress extends NumberControlPageObject {
  setValue(value: number) {
    cy.get(this.getSelector('numberInput'))
      .clear()
      .type(value.toString());
  }
}
