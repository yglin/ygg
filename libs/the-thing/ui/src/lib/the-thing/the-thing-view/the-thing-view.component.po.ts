import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { TheThingListPageObject } from '../the-thing-list/the-thing-list.component.po';

export abstract class TheThingViewPageObject extends PageObject {
  selectors = {
    main: '.the-thing-view',
    tags: '.tags',
    name: '.name',
    owner: '.owner',
    cells: '.cells',
    relationList: '.relation-list',
    buttonEdit: 'button.edit',
    buttonCreateByClone: 'button.create-clone'
  };

  abstract gotoEdit(): void;

  getSelectorForCell(cell?: TheThingCell): string {
    const cellSelector = !!cell ? `[cell-name="${cell.name}"]` : '[cell-name]';
    return `${this.getSelector('cells')} ${cellSelector}`;
  }

  getSelectorForRelation(relationName: string, objectThing?: TheThing): string {
    let selector = `${this.getSelector(
      'relationList'
    )} [relation-name="${relationName}"]`;
    if (objectThing) {
      const theThingListPO = new TheThingListPageObject(selector);
      selector = theThingListPO.getSelectorForTheThing(objectThing);
    }
    return selector;
  }
}
