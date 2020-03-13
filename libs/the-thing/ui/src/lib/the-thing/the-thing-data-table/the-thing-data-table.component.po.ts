import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing } from '@ygg/the-thing/core';

export abstract class TheThingDataTablePageObject extends PageObject {
  selectors = {
    main: '.the-thing-data-table',
    inputSearch: '.search input',
    checkboxSelectAll: '.toggle-select-all label input[type="checkbox"]'
  };

  getSelectorForFirst(): string {
    return `${this.getSelector()} tr.first`;
  }

  abstract expectTheThing(theThing: TheThing): void;
  abstract gotoTheThingView(theThing: TheThing): void;
  abstract gotoTheThingEdit(theThing: TheThing): void;
  abstract expectNotTheThing(theThings: TheThing | TheThing[]): void;
  abstract expectNotEmpty(): void;
  abstract expectEmpty(): void;
  // abstract deleteTheThing(theThing: TheThing): void;
  abstract select(theThings: TheThing[]): void;
  abstract selectAll(): void;
}
