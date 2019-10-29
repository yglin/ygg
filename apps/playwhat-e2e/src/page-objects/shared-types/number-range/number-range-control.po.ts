import { NumberRangeControlPageObject, NumberRange } from "@ygg/shared/types";

export class NumberRangeControlPageObjectCypress extends NumberRangeControlPageObject {
  
  setValue(numberRange: NumberRange) {
    cy.get(this.getSelector('inputMin')).clear();
    cy.get(this.getSelector('inputMax')).clear();
    cy.get(this.getSelector('inputMin')).type(numberRange.min.toString());
    cy.get(this.getSelector('inputMax')).type(numberRange.max.toString());
    cy.get(this.getSelector('inputMin')).should('have.value', numberRange.min.toString());
    cy.get(this.getSelector('inputMax')).should('have.value', numberRange.max.toString());
  }
}