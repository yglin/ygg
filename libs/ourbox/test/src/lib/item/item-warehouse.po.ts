import { ImitationItem } from '@ygg/ourbox/core';
import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingFinderPageObjectCypress } from '@ygg/the-thing/test';

export class ItemWarehousePageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.item-warehouse',
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

  expectNotItem(item: TheThing) {
    this.theThingFinderPO.expectNotTheThing(item);
  }

  expectItem(item: TheThing) {
    this.theThingFinderPO.expectTheThing(item);
  }

  expectItems(items: TheThing[]) {
    cy.wrap(items).each((item: TheThing) => this.expectItem(item));
  }

  expectNotItems(items: TheThing[]) {
    cy.wrap(items).each((item: TheThing) => this.expectNotItem(item));
  }
}
