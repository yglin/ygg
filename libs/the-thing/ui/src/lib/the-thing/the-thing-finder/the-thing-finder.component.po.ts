import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing, TheThingFilter } from '@ygg/the-thing/core';
import { ImageThumbnailListPageObject } from '@ygg/shared/ui/widgets';
import { TheThingFilterPageObject } from '../the-thing-filter/the-thing-filter.component.po';

export interface IInputTheThingFinder {
  filter: TheThingFilter;
}

export abstract class TheThingFinderPageObject extends PageObject {
  selectors = {
    main: '.the-thing-finder',
    filter: '.filter',
    inputSearchName: '.search-name input',
    theThingList: '.the-thing-list',
    buttonSubmit: 'button.submit'
  };
  imageThumbnailList: ImageThumbnailListPageObject;
  theThingFilterPO: TheThingFilterPageObject;

  expectTheThings(theThings: TheThing[]) {
    this.imageThumbnailList.expectItems(theThings);
  }

  setFilter(filter: TheThingFilter) {
    this.theThingFilterPO.setFilter(filter);
  }

  selectItem(theThing: TheThing) {
    this.imageThumbnailList.selectItem(theThing);
  }

  abstract find(theThing: TheThing): void;

  select(theThing: TheThing) {
    this.selectItem(theThing);
  }

  selectByFilter(filter: TheThingFilter, things: TheThing[]) {
    this.theThingFilterPO.setFilter(filter);
    this.imageThumbnailList.selectItems(things);
  }
}
