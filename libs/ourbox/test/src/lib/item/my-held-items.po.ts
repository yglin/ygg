import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingThumbnailPageObjectCypress, TheThingFinderPageObjectCypress } from '@ygg/the-thing/test';
import { ImitationItem } from '@ygg/ourbox/core';

export class MyHeldItemsPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.my-held-items',
    itemFinder: '.item-finder'
  };

  theThingFinderPO: TheThingFinderPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.theThingFinderPO = new TheThingFinderPageObjectCypress(
      this.getSelector('itemFinder'),
      ImitationItem
    );
  }

  getSelectorForItem(item: TheThing): string {
    return `${this.getSelector()} .item:contains("${item.name}")`;
  }

  gotoItem(item: TheThing) {
    this.theThingFinderPO.searchName(item.name);
    const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
      this.getSelectorForItem(item),
      ImitationItem
    );
    theThingThumbnailPO.gotoView();
  }
}
