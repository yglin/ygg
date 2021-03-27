import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { GeoBound, Location } from '@ygg/shared/geography/core';
import { Located } from '@ygg/shared/geography/core';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';
import { ImageThumbnailItem } from '@ygg/shared/ui/widgets';
import { Box } from '@ygg/ourbox/core';

export class MapNavigatorPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.map-navigator',
    inputBoundEast: '.bound-input input.east',
    inputBoundWest: '.bound-input input.west',
    inputBoundNorth: '.bound-input input.north',
    inputBoundSouth: '.bound-input input.south',
    buttonSetBound: '.bound-input button.set-bound',
    itemList: '.item-list'
  };

  itemListPO = new ImageThumbnailListPageObjectCypress();

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

  estimateBound(item: Located): GeoBound {
    return GeoBound.fromGeoPoint(item.location.geoPoint, [0.01, 0.02]);
  }

  locateItem(item: Located) {
    const bound = this.estimateBound(item);
    this.setMapBound(bound);
    this.itemListPO.expectItem((item as unknown) as ImageThumbnailItem);
  }

  expecItem(item: Located) {}

  expectNoItem(item: Located) {
    throw new Error('Method not implemented.');
  }

  panTo(location: Location) {
    throw new Error('Method not implemented.');
  }

  // expectItems(items: TheThing[]) {
  //   cy.wrap(items).each((item: TheThing) => {
  //     const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
  //       `${this.getSelector('itemList')} [item-name="${item.name}"]`,
  //       ImitationItem
  //     );
  //     theThingThumbnailPO.expectValue(item);
  //   });
  // }

  // expectNotItems(items: TheThing[]) {
  //   cy.wrap(items).each((item: TheThing) => {
  //     cy.get(`${this.getSelector('itemList')} [item-name="${item.name}"]`).should(
  //       'not.exist'
  //     );
  //   });
  // }
}
