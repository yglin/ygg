import { TheThing } from '@ygg/the-thing/core';
import { PageObject } from '@ygg/shared/test/page-object';

export class TheThingListPageObject extends PageObject {
  selectors = {
    main: '.the-thing-list'
  };

  getSelectorForTheThing(theThing?: TheThing): string {
    const attrSelector = !!theThing
      ? `[the-thing-id="${theThing.id}"]`
      : '[the-thing-id]';
    return `${this.getSelector()} ${attrSelector}`;
  }

  getSelectorForTheThingDelete(theThing: TheThing): string {
    return `${this.getSelectorForTheThing(theThing)} .delete button`;
  }
}
