import { NumberRangeControlPageObject, NumberRange } from "@ygg/shared/types";

export class NumberRangeControlPageObjectCypress extends NumberRangeControlPageObject {
  
  setValue(numberRange: NumberRange) {
    cy.get(this.getSelector('inputMin')).clear().type(numberRange.min.toString());
    cy.get(this.getSelector('inputMax')).clear().type(numberRange.max.toString());
    this.expectValue(numberRange);
  }

  expectValue(numberRange: NumberRange) {
    cy.get(this.getSelector('inputMin')).should('have.value', numberRange.min.toString());
    cy.get(this.getSelector('inputMax')).should('have.value', numberRange.max.toString());
  }
}