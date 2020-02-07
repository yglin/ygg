import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing } from '@ygg/the-thing/core';
import { ImageThumbnailListPageObject } from '@ygg/shared/ui/widgets';

export abstract class TheThingFinderPageObject extends PageObject {
  selectors = {
    main: '.the-thing-finder',
    tagsFilter: '.tags-filter',
    inputSearchName: '.search-name input',
    theThingList: '.the-thing-list',
    buttonSubmit: 'button.submit'
  };
  imageThumbnailList: ImageThumbnailListPageObject;

  expectTheThings(theThings: TheThing[]) {
    this.imageThumbnailList.expectItems(theThings);
  }

  selectItem(theThing: TheThing) {
    this.imageThumbnailList.selectItem(theThing);
  }

  abstract find(theThing: TheThing): void;

  select(theThing: TheThing) {
    this.find(theThing);
    this.selectItem(theThing);
  }
}
