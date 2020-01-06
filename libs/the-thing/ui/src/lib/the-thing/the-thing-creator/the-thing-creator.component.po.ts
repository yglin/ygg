import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';

export abstract class TheThingCreatorPageObject extends PageObject {
  selectors = {
    main: '.the-thing-creator',
    lastCellControl: '.cells .last-cell',
    inputRelationName: '.add-relation input.relation-name',
    buttonFindRelationObject: '.add-relation button.the-thing-finder',
    // buttonAddRelation: '.add-relation button.add',
    relationList: '.relation-list'
  };

  getSelectorForRelation(relationName: string, objectThing: TheThing): string {
    return `${this.getSelector(
      'relationList'
    )} [relation-name="${relationName}"] [the-thing-id="${objectThing.id}"]`;
  }

  abstract setValue(value: TheThing): void;
  abstract addRelationExist(relationName: string, objectThing: TheThing): void;
  abstract submit(): void;
  abstract addCell(cell: TheThingCell): void;
}
