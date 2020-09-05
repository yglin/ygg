import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { GeoBound } from '@ygg/shared/geography/core';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingThumbnailPageObjectCypress } from '@ygg/the-thing/test';
import { ImitationItem } from '@ygg/ourbox/core';

export class MapSearchPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.map-search',
    inputBoundEast: '.bound-input input.east',
    inputBoundWest: '.bound-input input.west',
    inputBoundNorth: '.bound-input input.north',
    inputBoundSouth: '.bound-input input.south',
    buttonSetBound: '.bound-input button.set-bound',
    itemList: '.item-list'
  };

  setMapBound(bound: GeoBound) {
    cy.get(this.getSelector(`inputBoundEast`))
      .clear()
      .type(bound.east.toString());
    cy.get(this.getSelector(`inputBoundWest`))
      .clear()
      .type(bound.west.toString());
    cy.get(this.getSelector(`inputBoundNorth`))
      .clear()
      .type(bound.north.toString());
    cy.get(this.getSelector(`inputBoundSouth`))
      .clear()
      .type(bound.south.toString());
    cy.get(this.getSelector('buttonSetBound')).click();
  }

  expectItems(items: TheThing[]) {
    cy.wrap(items).each((item: TheThing) => {
      const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
        `${this.getSelector('itemList')} [item-id="${item.id}"]`,
        ImitationItem
      );
      theThingThumbnailPO.expectValue(item);
    });
  }

  expectNotItems(items: TheThing[]) {
    cy.wrap(items).each((item: TheThing) => {
      cy.get(`${this.getSelector('itemList')} [item-id="${item.id}"]`).should(
        'not.exist'
      );
    });
  }
}
