import { values } from 'lodash';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { TheThingEditorPageObject } from '@ygg/the-thing/ui';
import {
  AlbumControlPageObjectCypress,
  AddressControlPageObjectCypress
} from '../cell-types';
import { TheThingFinderPageObjectCypress } from './the-thing-finder.po';
import { ChipsControlPageObjectCypress } from '@ygg/shared/test/cypress';

export class TheThingEditorPageObjectCypress extends TheThingEditorPageObject {
  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  addCell(cell: TheThingCell) {
    cy.get('.add-cell .name input')
      .clear({ force: true })
      .type(cell.name);
    cy.get('.add-cell .tags select').select(cell.type);
    cy.get('.add-cell button').click({ force: true });
    switch (cell.type) {
      case 'text':
        cy.get(`${this.getSelectorForCellControl(cell)} input`)
          .clear({ force: true })
          .type(cell.value);
        break;
      case 'longtext':
        cy.get(`${this.getSelectorForCellControl(cell)} textarea`)
          .clear({ force: true })
          .type(cell.value);
        break;
      case 'number':
        cy.get(`${this.getSelectorForCellControl(cell)} input`)
          .clear({ force: true })
          .type(cell.value.toString());
        break;
      case 'album':
        const albumControlPO = new AlbumControlPageObjectCypress(
          this.getSelectorForCellControl(cell)
        );
        albumControlPO.setValue(cell.value);
        break;
      case 'address':
        const addressControlPO = new AddressControlPageObjectCypress(
          this.getSelectorForCellControl(cell)
        );
        addressControlPO.setValue(cell.value);
        break;
      default:
        break;
    }
  }

  setTags(tags: string[]) {
    const chipsControlPO = new ChipsControlPageObjectCypress(
      this.getSelector()
    );
    chipsControlPO.setValue(tags);
  }

  setName(name: string) {
    cy.get('.meta .name input')
      .clear({ force: true })
      .type(name);
  }

  deleteCell(cell: TheThingCell) {
    cy.get(this.getSelectorForCellControlDelete(cell)).click({ force: true });
  }

  setValue(theThing: TheThing) {
    this.setTags(theThing.tags.toNameArray());

    this.setName(theThing.name);

    // Add cells
    cy.wrap(values(theThing.cells)).each((cell: any) => this.addCell(cell));
  }

  addRelationExist(relationName: string, objectThing: TheThing) {
    cy.get(this.getSelector('inputRelationName'))
      .clear({ force: true })
      .type(relationName);
    cy.get(this.getSelector('buttonFindRelationObject')).click({ force: true });
    const theThingFinderPO = new TheThingFinderPageObjectCypress();
    theThingFinderPO.select(objectThing);
    theThingFinderPO.submit();
    // cy.get(this.getSelector('buttonAddRelation')).click({ force: true });
    this.expectRelation(relationName, objectThing);
  }

  expectRelation(relationName: string, objectThing: TheThing) {
    cy.get(this.getSelectorForRelation(relationName, objectThing)).should(
      'be.exist'
    );
  }

  addRelationAndGotoCreate(relationName: string) {
    cy.get(this.getSelector('inputRelationName'))
      .clear({ force: true })
      .type(relationName);
    cy.get(this.getSelector('buttonCreateRelationObject')).click({
      force: true
    });
  }

  submit() {
    // Submit
    cy.get('button.submit').click();
  }
}
