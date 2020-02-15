import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing } from '@ygg/the-thing/core';

export abstract class TheThingDataTablePageObject extends PageObject {
  selectors = {
    main: '.the-thing-data-table'
  };

  getSelectorForTheThing(theThing: TheThing): string {
    return `${this.getSelector()} [the-thing-id="${theThing.id}"]`;
  }
  
  getSelectorForFirst(): string {
    return `${this.getSelector()} tr.first`;
  }

  abstract expectTheThing(theThing: TheThing): void;
  abstract clickTheThing(theThing: TheThing): void;
}
