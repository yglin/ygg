import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingThumbnailPageObjectCypress } from '@ygg/the-thing/test';
import { ImitationItem } from '@ygg/ourbox/core';

export class ItemWarehousePageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.item-warehouse',
    itemList: '.item-list'
  };

  getSelectorForItem(item: TheThing): string {
    return `${this.getSelector()} .item:contains("${item.name}")`;
  }

  expectNotItem(item: TheThing) {
    cy.get(this.getSelectorForItem(item)).should('not.exist');
  }

  expectItem(item: TheThing) {
    const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
      this.getSelectorForItem(item),
      ImitationItem
    );
    theThingThumbnailPO.expectValue(item);
  }
}
