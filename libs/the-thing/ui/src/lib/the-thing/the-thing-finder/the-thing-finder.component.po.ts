import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing } from '@ygg/the-thing/core';

export abstract class TheThingFinderPageObject extends PageObject {
  selectors = {
    main: '.the-thing-finder',
    tagsFilter: '.tags-filter',
    inputSearchName: '.search-name input',
    theThingList: '.the-thing-list'
  };

  abstract select(theThing: TheThing): void;

  getSelectorForTheThing(theThing: TheThing): string {
    return `${this.getSelector('theThingList')} [the-thing-id="${
      theThing.id
    }"]`;
  }
}
