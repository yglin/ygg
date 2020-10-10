import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { GeoBound } from '@ygg/shared/geography/core';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingThumbnailPageObjectCypress } from '@ygg/the-thing/test';
import { ImitationItem } from '@ygg/ourbox/core';
import { Location, OmniTypes } from '@ygg/shared/omni-types/core';

export class MapSearchPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.map-search',
    inputCenterLat: '.center input.lat',
    inputCenterLng: '.center input.lng',
    buttonSetCenter: '.center button.set-center',
    inputBoundEast: '.bound-input input.east',
    inputBoundWest: '.bound-input input.west',
    inputBoundNorth: '.bound-input input.north',
    inputBoundSouth: '.bound-input input.south',
    buttonSetBound: '.bound-input button.set-bound',
    itemList: '.item-list'
  };

  centerAtItem(testItem: TheThing) {
    const location: Location = testItem.getCellValueOfType(
      OmniTypes.location.id
    );
    if (!Location.isLocation(location)) {
      throw new Error(`Not found location cell of ${testItem.id}`);
    }
    this.setMapCenter(location.geoPoint.latitude, location.geoPoint.longitude);
  }

  setMapCenter(latitude: number, longitude: number) {
    cy.get(this.getSelector(`inputCenterLat`))
      .clear()
      .type(latitude.toString());
    cy.get(this.getSelector(`inputCenterLng`))
      .clear()
      .type(longitude.toString());
    cy.get(this.getSelector('buttonSetCenter')).click();
  }

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
        `${this.getSelector('itemList')} [item-name="${item.name}"]`,
        ImitationItem
      );
      theThingThumbnailPO.expectValue(item);
    });
  }

  expectNotItems(items: TheThing[]) {
    cy.wrap(items).each((item: TheThing) => {
      cy.get(
        `${this.getSelector('itemList')} [item-name="${item.name}"]`
      ).should('not.exist');
    });
  }
}
