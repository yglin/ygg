import { values } from 'lodash';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { TheThingCreatorPageObject } from "@ygg/the-thing/ui";
import { AlbumControlPageObjectCypress } from "../cell-types";

export class TheThingCreatorPageObjectCypress extends TheThingCreatorPageObject {
  setValueText(value: string) {
    cy.get('.last-cell input')
      .clear({ force: true })
      .type(value);
  }

  setValueLongtext(value: string) {
    cy.get('.last-cell textarea')
      .clear({ force: true })
      .type(value);
  }

  setValueNumber(value: number) {
    cy.get('.last-cell input')
      .clear({ force: true })
      .type(value.toString());
  }

  addCell(cell: TheThingCell) {
    cy.get('.add-cell .name input')
      .clear({force: true})
      .type(cell.name);
    cy.get('.add-cell .types select').select(cell.type);
    cy.get('.add-cell button').click({ force: true });
    switch (cell.type) {
      case 'text':
        this.setValueText(cell.value);
        break;
      case 'longtext':
        this.setValueLongtext(cell.value);
        break;
      case 'number':
        this.setValueNumber(cell.value);
        break;
      case 'album': 
        const albumControlPO = new AlbumControlPageObjectCypress(this.getSelector('lastCellControl'));
        albumControlPO.setValue(cell.value);
        break;
      default:
        break;
    }
  }

  setValue(theThing: TheThing) {
    // Choose type tags of the-thing
    cy.wrap(theThing.types).each((type: string) => {
      cy.get('.meta .types input')
        .clear({force: true})
        .type(type);
      cy.get('.types button.add').click({force: true});
    });

    // Input name of the thing
    cy.get('.meta .name input')
      .clear({force: true})
      .type(theThing.name);

    // Add cells
    cy.wrap(values(theThing.cells)).each((cell: any) => this.addCell(cell));
  }

  submit() {
    // Submit
    cy.get('button.submit').click();
  }
}
