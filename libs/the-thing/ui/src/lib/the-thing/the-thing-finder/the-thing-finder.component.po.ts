import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing } from '@ygg/the-thing/core';

export class TheThingFinderPageObject extends PageObject {
  selectors = {
    main: '.the-thing-finder',
    tagsFilter: '.tags-filter',
    inputSearchName: '.search-name input',
    buttonSubmit: 'button.submit',
    theThingList: '.the-thing-list'
  };

  getSelectorForTheThing(theThing: TheThing): string {
    return `${this.getSelector('theThingList')} [the-thing-id="${
      theThing.id
    }"]`;
  }
}
