import { NumberRangeViewPageObject, NumberRange } from "@ygg/shared/types";

export class NumberRangeViewPageObjectCypress extends NumberRangeViewPageObject {

  expectValue(value: NumberRange) {
    cy.get(this.getSelector('min')).contains(value.min);
    cy.get(this.getSelector('max')).contains(value.max);
  }
}