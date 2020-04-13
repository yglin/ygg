import { TextViewPageObject } from '@ygg/shared/omni-types/ui';

export class TextViewPageObjectCypress extends TextViewPageObject {
  expectValue(value: string): void {
    cy.get(this.getSelector('value')).should('have.text', value);
  }
}
