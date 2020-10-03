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
    state: '.state',
    buttonOpenImageUploader: '.main-image .edit button.open-image-uploader',
    buttonSetImageFromAlbumCover: '.main-image .edit button.set-album-cover',
    mainImage: '.main-image img'
  };
  imitation: TheThingImitation;

  statePO: TheThingStatePageObject;

  constructor(parentSelector: string, imitation: TheThingImitation) {
    super(parentSelector);
    this.imitation = imitation;
  }

  getSelectorForCell(cell: TheThingCell | string): string {
    let cellId: string;
    if (typeof cell === 'string') {
      cellId = cell;
    } else {
      cellId = cell.id;
    }
    return `${this.getSelector()} .cells [cell-id="${cellId}"]`;
  }

  getSelectorForCellDeleteButton(cellId: string): string {
    return `${this.getSelectorForCell(cellId)} button.delete`;
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
    return `${this.getSelector()} [action-id="${action.id}"] .action-button`;
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
