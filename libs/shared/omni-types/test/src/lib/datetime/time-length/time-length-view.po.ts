import { TimeLengthViewPageObject } from '@ygg/shared/omni-types/ui';
import { TimeLength } from '@ygg/shared/omni-types/core';

export class TimeLengthViewPageObjectCypress extends TimeLengthViewPageObject {
  expectValue(value: TimeLength): void {
    cy.get(this.getSelector('value')).should('have.text', value.format());
  }
}
