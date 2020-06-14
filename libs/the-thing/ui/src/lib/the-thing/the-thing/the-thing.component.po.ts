import { PageObject } from '@ygg/shared/test/page-object';
import {
  TheThing,
  TheThingCell,
  Relationship,
  TheThingImitation,
  TheThingAction,
  TheThingState
} from '@ygg/the-thing/core';
import { TheThingStatePageObject } from '../the-thing-state/the-thing-state.component.po';

export abstract class TheThingPageObject extends PageObject {
  selectors = {
    main: '.the-thing',
    name: '.name',
    buttonAddCell: 'button.add-cell',
    buttonSave: 'button.save',
    state: '.state'
  };
  imitation: TheThingImitation;

  statePO: TheThingStatePageObject;

  constructor(parentSelector: string, imitation: TheThingImitation) {
    super(parentSelector);
    this.imitation = imitation;
  }

  getSelectorForCell(cell: TheThingCell | string): string {
    let cellName: string;
    if (typeof cell === 'string') {
      cellName = cell;
    } else {
      cellName = cell.name;
    }
    return `${this.getSelector()} .cells [cell-name="${cellName}"]`;
  }

  getSelectorForCellDeleteButton(cellName: string): string {
    return `${this.getSelectorForCell(cellName)} button.delete`;
  }

  getSelectorForRelation(relationName: string): string {
    return `${this.getSelector()} [relation-name="${relationName}"]`;
  }

  getSelectorForRelationCreateButton(relationName: string): string {
    return `${this.getSelectorForRelation(
      relationName
    )} button.create-relate-object`;
  }

  getSelectorForRelationObject(relationName: string, obj: TheThing): string {
    return `${this.getSelectorForRelation(
      relationName
    )} .relation-object:contains("${obj.name}")`;
  }

  getSelectorForActionButton(action: TheThingAction): string {
    return `${this.getSelector()} button.action.${action.id}`;
  }

  getSelectorForModifyButtons(): string {
    return `${this.getSelector()} button.edit`;
  }

  expectState(state: TheThingState) {
    this.statePO.expectValue(state);
  }

  abstract clickSave(): void;
  abstract expectFreshNew(): void;
  abstract expectName(value: string): void;
  abstract setCell(cell: TheThingCell): void;
  abstract addCell(cell: TheThingCell): void;
  abstract expectNoCell(cell: TheThingCell): void;
  abstract deleteCell(cell: TheThingCell): void;
  abstract expectCell(cell: TheThingCell): void;
  abstract setValue(theThing: TheThing): void;
  abstract save(theThing: TheThing): void;
  abstract expectVisible(): void;
  abstract expectValue(theThing: TheThing): void;
  abstract gotoCreateRelationObject(relationship: Relationship): void;
  abstract expectRelationObjects(
    relationship: Relationship,
    objects: TheThing[]
  ): void;
  abstract runAction(action: TheThingAction);
  abstract expectActionButton(action: TheThingAction);
  abstract expectNoActionButton(action: TheThingAction);
  abstract expectModifiable(): void;
  abstract expectReadonly(): void;
}