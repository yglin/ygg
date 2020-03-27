import { PageObject } from '@ygg/shared/test/page-object';
import { Location, Address, GeoPoint } from '@ygg/shared/omni-types/core';
import { AddressViewPageObject } from '../address';
import { GeoPointViewPageObject } from '../geo-point/geo-point-view/geo-point-view.component.po';

export abstract class LocationViewPageObject extends PageObject {
  selectors = {
    main: '.location-view',
    address: '.address',
    geoPoint: '.geo-point'
  };
  addressViewPO: AddressViewPageObject;
  geoPointViewPO: GeoPointViewPageObject;

  expectValue(location: Location) {
    if (Location.isLocation(location)) {
      if (Address.isAddress(location.address)) {
        this.addressViewPO.expectValue(location.address);
      }
      if (GeoPoint.isGeoPoint(location.geoPoint)) {
        this.geoPointViewPO.expectValue(location.geoPoint);
      }
    }
  }
}
