import { PageObject } from '@ygg/shared/test/page-object';
import {
  TheThing,
  TheThingCell,
  Relationship,
  TheThingImitation,
  TheThingAction
} from '@ygg/the-thing/core';

export abstract class TheThingPageObject extends PageObject {
  selectors = {
    main: '.the-thing',
    name: '.name',
    buttonAddCell: 'button.add-cell',
    buttonSave: 'button.save'
  };
  imitation: TheThingImitation;

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
  // getSelectorForEquipment(equip: TheThing): string {
  //   return `${this.getSelector('equipments')} .equipment:contains("${
  //     equip.name
  //   }")`;
  // }

  abstract expectVisible(): void;
  abstract expectValue(theThing: TheThing): void;
  abstract gotoCreateRelationObject(relationship: Relationship): void;
  abstract expectRelationObjects(
    relationship: Relationship,
    objects: TheThing[]
  ): void;
}
