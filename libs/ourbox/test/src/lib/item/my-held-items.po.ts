import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingThumbnailPageObjectCypress } from '@ygg/the-thing/test';
import { ImitationItem } from '@ygg/ourbox/core';

export class MyHeldItemsPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.my-held-items'
  };

  getSelectorForItem(item: TheThing): string {
    return `${this.getSelector()} .item:contains("${item.name}")`;
  }

  gotoItem(item: TheThing) {
    const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
      this.getSelectorForItem(item),
      ImitationItem
    );
    theThingThumbnailPO.gotoView();
  }
}
