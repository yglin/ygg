import { values } from 'lodash';
import { TheThing, TheThingCell, TheThingImitation } from '@ygg/the-thing/core';
import { TheThingEditorPageObject } from '@ygg/the-thing/ui';
import {
  AlbumControlPageObjectCypress,
  AddressControlPageObjectCypress
} from '../cell-types';
import {
  HtmlControlPageObjectCypress,
  DateRangeControlPageObjectCypress,
  DayTimeRangeControlPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { ChipsControlPageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThingListPageObjectCypress } from './the-thing-list.po';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';
import { ImageThumbnailListPageObject } from '@ygg/shared/ui/widgets';
import { TheThingFinderPageObjectCypress } from './the-thing-finder.po';
import { TheThingCellsEditorPageObjectCypress } from '../cell';

export class TheThingEditorPageObjectCypress extends TheThingEditorPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.theThingCellsEditorPO = new TheThingCellsEditorPageObjectCypress(
      this.getSelector('cellsEditor')
    );
  }

  expectVisible() {
    cy.get(this.getSelector(), { timeout: 20000 }).should('be.visible');
  }

  // setCell(cell: TheThingCell) {
  //   switch (cell.type) {
  //     case 'text':
  //       cy.get(`${this.getSelectorForCellControl(cell)} input`)
  //         .clear({ force: true })
  //         .type(cell.value);
  //       break;
  //     case 'longtext':
  //       cy.get(`${this.getSelectorForCellControl(cell)} textarea`)
  //         .clear({ force: true })
  //         .type(cell.value);
  //       break;
  //     case 'number':
  //       cy.get(`${this.getSelectorForCellControl(cell)} input`)
  //         .clear({ force: true })
  //         .type(cell.value.toString());
  //       break;
  //     case 'album':
  //       const albumControlPO = new AlbumControlPageObjectCypress(
  //         this.getSelectorForCellControl(cell)
  //       );
  //       albumControlPO.setValue(cell.value);
  //       break;
  //     case 'html':
  //       const htmlControlPO = new HtmlControlPageObjectCypress(
  //         this.getSelectorForCellControl(cell)
  //       );
  //       htmlControlPO.setValue(cell.value);
  //       break;
  //     case 'address':
  //       const addressControlPO = new AddressControlPageObjectCypress(
  //         this.getSelectorForCellControl(cell)
  //       );
  //       addressControlPO.setValue(cell.value);
  //       break;
  //     case 'date-range':
  //       const dateRangeControlPO = new DateRangeControlPageObjectCypress(
  //         this.getSelectorForCellControl(cell)
  //       );
  //       // cy.log(cell.value);
  //       dateRangeControlPO.setValue(cell.value);
  //       break;
  //     case 'day-time-range':
  //       const dayTimeRangeControlPO = new DayTimeRangeControlPageObjectCypress(
  //         this.getSelectorForCellControl(cell)
  //       );
  //       dayTimeRangeControlPO.setValue(cell.value);
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // addCell(cell: TheThingCell) {
  //   cy.get(this.getSelector('inputCellName'))
  //     .clear({ force: true })
  //     .type(cell.name);
  //   cy.get(this.getSelector('selectCellType')).select(cell.type);
  //   cy.get(this.getSelector('buttonAddCell')).click();
  //   cy.get(this.getSelectorForCellControl(cell)).should('be.exist');
  //   this.setCell(cell);
  // }

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

  setView(view: string) {
    if (!!view) {
      cy.get(this.getSelector('selectView')).select(view);
    }
  }

  setImitation(imitationId: string) {
    cy.get(this.getSelector('selectImitation')).select(imitationId);
  }

  // deleteCell(cell: TheThingCell) {
  //   cy.get(this.getSelectorForCellControlDelete(cell)).click({ force: true });
  // }

  // deleteAllCells() {
  //   cy.get(this.getSelector('buttonDeleteAllCells')).click({ force: true });
  // }

  setValue(theThing: TheThing) {
    this.setTags(theThing.tags.toNameArray());
    this.setName(theThing.name);
    this.setView(theThing.view);
    this.theThingCellsEditorPO.setValue(values(theThing.cells));

    // if (theThing.imitation) {
    //   this.setImitation(theThing.imitation);
    // }

    // Add cells
    // cy.wrap(values(theThing.cells)).each((cell: any) => this.addCell(cell));
  }

  addRelationExist(relationName: string, objectThing: TheThing) {
    cy.get(this.getSelector('inputRelationName'))
      .clear({ force: true })
      .type(relationName);
    cy.get(this.getSelector('buttonFindRelationObject')).click({ force: true });
    const theThingFinderDialogPO = new TheThingFinderPageObjectCypress();
    theThingFinderDialogPO.select(objectThing);
    theThingFinderDialogPO.submit();
    // cy.get(this.getSelector('buttonAddRelation')).click({ force: true });
    this.expectRelation(relationName, objectThing);
  }

  removeRelation(relationName: string, objectThing: TheThing) {
    const relationObjectListPO = new ImageThumbnailListPageObjectCypress(
      this.getSelectorForRelationObjects(relationName)
    );
    relationObjectListPO.deleteItem(objectThing);
  }

  expectRelation(relationName: string, objectThing: TheThing) {
    const relationObjectListPO = new ImageThumbnailListPageObjectCypress(
      this.getSelectorForRelationObjects(relationName)
    );
    relationObjectListPO.expectItem(objectThing);
  }

  // addRelationAndGotoCreate(relationName: string) {
  //   cy.get(this.getSelector('inputRelationName'))
  //     .clear({ force: true })
  //     .type(relationName);
  //   cy.get(this.getSelector('buttonCreateRelationObject')).click({
  //     force: true
  //   });
  //   cy.location().should('match', /the-things\/create\/?/);
  // }

  expectImitaion(imitation: TheThingImitation) {
    cy.get(this.getSelector('buttonOpenImitations'), {
      timeout: 10000
    }).click();
    const imitationSelectorDialogPO = new ImageThumbnailListPageObjectCypress();
    imitationSelectorDialogPO.expectVisible();
    imitationSelectorDialogPO.expectItemByNameAndImage(imitation);
  }

  applyImitation(imitation: TheThingImitation) {
    cy.get(this.getSelector('buttonOpenImitations'), {
      timeout: 10000
    }).click();
    const imitationSelectorDialogPO = new ImageThumbnailListPageObjectCypress();
    imitationSelectorDialogPO.expectVisible();
    imitationSelectorDialogPO.selectItem(imitation);
    imitationSelectorDialogPO.submit();
    imitationSelectorDialogPO.expectVisible(false);
  }

  extendValue(theThing: TheThing) {
    this.setTags(theThing.tags.toNameArray());
    this.setName(theThing.name);
    this.setView(theThing.view);
    this.theThingCellsEditorPO.updateValue(values(theThing.cells));

    // // Set cells value, here is the difference from setValue().
    // // Each cell control should already be there
    // cy.wrap(values(theThing.cells)).each((cell: any) => {
    //   cy.get(this.getSelectorForCellControl(cell)).should('be.exist');
    //   this.setCell(cell);
    // });
  }

  // updateCellValues(cells: TheThingCell[]) {
  //   cy.wrap(cells).each((cell: any) => {
  //     cy.get(this.getSelectorForCellControl(cell)).should('be.exist');
  //     this.setCell(cell);
  //   });
  // }

  submit() {
    // Submit
    cy.get('button.submit').click();
  }
}
