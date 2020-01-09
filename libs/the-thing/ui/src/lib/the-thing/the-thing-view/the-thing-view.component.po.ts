import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';

export class TheThingViewPageObject extends PageObject {
  selectors = {
    main: '.the-thing-view',
    tags: '.tags',
    name: '.name',
    cells: '.cells',
    relationList: '.relation-list',
    buttonLinkRelationBack: 'button.link-relation-back'
  };

  getSelectorForCell(cell?: TheThingCell): string {
    const cellSelector = !!cell ? `[cell-name="${cell.name}"]` : '[cell-name]';
    return `${this.getSelector('cells')} ${cellSelector}`;
  }

  getSelectorForRelation(relationName: string, objectThing: TheThing): string {
    return `${this.getSelector(
      'relationList'
    )} [relation-name="${relationName}"] [the-thing-id="${objectThing.id}"]`;
  }
}
