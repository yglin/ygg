import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { TheThingCellsEditorPageObject } from '../../cell';

export abstract class TheThingEditorPageObject extends PageObject {
  selectors = {
    main: '.the-thing-editor',
    // selectImitation: '.meta .imitation select',
    cellsEditor: '.cells-editor',
    inputRelationName: '.add-relation input.relation-name',
    buttonFindRelationObject: '.add-relation button.the-thing-finder',
    buttonCreateRelationObject: '.add-relation button.the-thing-create',
    // buttonAddRelation: '.add-relation button.add',
    // cellControls: '.cell-controls',
    // inputCellName: '.add-cell input.name',
    // selectCellType: '.add-cell select.cell-type',
    // buttonAddCell: '.add-cell button.add',
    // buttonDeleteAllCells: '.cell-controls button.delete-all',
    relationList: '.relation-list',
    buttonOpenImitations: 'button.open-imitations',
    selectView: 'select.view'
  };
  theThingCellsEditorPO: TheThingCellsEditorPageObject;

  // getSelectorForCellControl(cell: TheThingCell): string {
  //   return `${this.getSelector('cellControls')} [cell-name="${cell.name}"]`;
  // }

  // getSelectorForCellControlDelete(cell: TheThingCell): string {
  //   return `${this.getSelectorForCellControl(cell)} button.delete`;
  // }

  getSelectorForRelation(relationName: string, objectThing: TheThing): string {
    return `${this.getSelector(
      'relationList'
    )} [relation-name="${relationName}"] [the-thing-id="${objectThing.id}"]`;
  }

  getSelectorForRelationObjects(relationName: string): string {
    return `${this.getSelector(
      'relationList'
    )} [relation-name="${relationName}"]`;
  }

  getSelectorForRelationDelete(
    relationName: string,
    objectThing: TheThing
  ): string {
    return `${this.getSelectorForRelation(
      relationName,
      objectThing
    )} button.delete`;
  }

  abstract setValue(value: TheThing): void;
  abstract extendValue(value: TheThing): void;
  abstract addRelationExist(relationName: string, objectThing: TheThing): void;
  abstract submit(): void;
  // abstract addCell(cell: TheThingCell): void;
  // abstract updateCellValues(cells: TheThingCell[]): void
}
