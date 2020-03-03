import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { TheThingCellsEditorPageObject } from '../../cell';

export abstract class TheThingEditorPageObject extends PageObject {
  selectors = {
    main: '.the-thing-editor',
    inputMetaName: '.meta .name input',
    cellsEditor: '.cells-editor',
    inputRelationName: '.add-relation input.relation-name',
    // buttonFindRelationObject: '.add-relation button.the-thing-finder',
    // buttonCreateRelationObject: '.add-relation button.the-thing-create',
    relationsEditors: '.relations-editors',
    buttonOpenImitations: 'button.open-imitations',
    selectView: 'select.view',
    relationCreateHint: '.relation-create-hint',
    buttonCancelCreateRelation: '.relation-create-hint button.cancel',
    buttonAddRelation: 'button.add-relation'
  };
  theThingCellsEditorPO: TheThingCellsEditorPageObject;

  // getSelectorForCellControl(cell: TheThingCell): string {
  //   return `${this.getSelector('cellControls')} [cell-name="${cell.name}"]`;
  // }

  // getSelectorForCellControlDelete(cell: TheThingCell): string {
  //   return `${this.getSelectorForCellControl(cell)} button.delete`;
  // }

  getSelectorForRelationsEditor(relationName: string): string {
    return `${this.getSelector(
      'relationsEditors'
    )} [relation-name="${relationName}"]`;
  }

  abstract setValue(value: TheThing): void;
  abstract extendValue(value: TheThing): void;
  abstract addRelationExist(relationName: string, objectThing: TheThing): void;
  abstract submit(): void;
  // abstract addCell(cell: TheThingCell): void;
  // abstract updateCellValues(cells: TheThingCell[]): void
}
