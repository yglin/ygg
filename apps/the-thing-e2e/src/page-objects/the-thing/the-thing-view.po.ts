import { values } from "lodash";
import { TheThing, TheThingCell } from "@ygg/the-thing/core";

export class TheThingViewPageObjectCypress {

  expectCellText(cell: TheThingCell) {
    cy.get(`.cell[cell-name="${cell.name}"]`).contains(cell.value);
  }
  
  expectCelllongtext = this.expectCellText;
  
  expectCellNumber(cell: TheThingCell) {
    cy.get(`.cell[cell-name="${cell.name}"]`).contains(cell.value.toString());
  }
  
  expectCell(cell: TheThingCell) {
    switch (cell.type) {
      case 'text':
        this.expectCellText(cell);
        break;
  
      case 'longtext':
        this.expectCelllongtext(cell);
        break;
  
      case 'number':
        this.expectCellNumber(cell);
        break;
  
      default:
        break;
    }
  }
  
  
  expectValue(theThing: TheThing) {
    // Expect types
    cy.wrap(theThing.types).each((type: string) => {
      cy.get('.types').contains(type);
    });

    // Expect name
    cy.get('.name').contains(theThing.name);

    // Expect cells
    cy.wrap(values(theThing.cells)).each((cell: any) => {
      this.expectCell(cell);
    });
  }
}