import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing } from '@ygg/the-thing/core';

export abstract class TheThingDataTablePageObject extends PageObject {
  selectors = {
    main: '.the-thing-data-table',
    inputSearch: '.search input'
  };

  getSelectorForFirst(): string {
    return `${this.getSelector()} tr.first`;
  }

  abstract expectTheThing(theThing: TheThing): void;
  abstract clickTheThing(theThing: TheThing): void;
  abstract expectNotTheThing(theThing: TheThing): void;
  abstract deleteTheThing(theThing: TheThing): void;
}
