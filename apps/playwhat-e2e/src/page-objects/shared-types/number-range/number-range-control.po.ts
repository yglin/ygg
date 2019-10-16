import { NumberRangeControlPageObject, NumberRange } from "@ygg/shared/types";

export class NumberRangeControlPageObjectCypress extends NumberRangeControlPageObject {
  
  setValue(numberRange: NumberRange) {
    cy.get(this.getSelector('inputMin')).clear().type(numberRange.min.toString());
    cy.get(this.getSelector('inputMax')).clear().type(numberRange.max.toString());
  }
}