import { LongTextViewPageObject } from '@ygg/shared/omni-types/ui';

export class LongTextViewPageObjectCypress extends LongTextViewPageObject {
  expectValue(value: string): void {
    cy.get(this.getSelector('value')).should('have.text', value);
  }
}
