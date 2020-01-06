import { values } from 'lodash';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { TheThingViewPageObject } from '@ygg/the-thing/ui';
import { AlbumViewPageObjectCypress, AddressViewPageObjectCypress } from '../cell-types';

class Relation {
  name: string;
  description: string;
  subjectId: string;
  objectId: string;  
}

export class TheThingViewPageObjectCypress extends TheThingViewPageObject {
  expectCell(cell: TheThingCell) {
    switch (cell.type) {
      case 'text':
        cy.get(this.getSelectorForCell(cell)).contains(cell.value);
        break;

      case 'longtext':
        cy.get(this.getSelectorForCell(cell)).contains(cell.value);
        break;

      case 'number':
        cy.get(this.getSelectorForCell(cell)).contains(cell.value.toString());
        break;

      case 'album':
        const albumViewPO = new AlbumViewPageObjectCypress(
          this.getSelectorForCell(cell)
        );
        albumViewPO.expectValue(cell.value);
        break;

      case 'address':
        const addressViewPO = new AddressViewPageObjectCypress(
          this.getSelectorForCell(cell)
        );
        addressViewPO.expectValue(cell.value);
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

  expectRelation(relationName: string, objectThing: TheThing) {
    cy.get(this.getSelectorForRelation(relationName, objectThing)).contains(objectThing.name);
  }
}
