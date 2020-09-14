import { PageObject } from '@ygg/shared/test/page-object';
import { Location, Address } from '@ygg/shared/omni-types/core';
import { AddressControlPageObject } from '../address';
import { GeoPointControlPageObject } from '../geo-point/geo-point-control/geo-point-control.component.po';
import { GeoPoint } from '@ygg/shared/geography/core';

export abstract class LocationControlPageObject extends PageObject {
  selectors = {
    main: '.location-control',
    address: '.address',
    geoPoint: '.geo-point'
  };
  addressControlPO: AddressControlPageObject;
  geoPointControlPO: GeoPointControlPageObject;

  setValue(location: Location) {
    if (Location.isLocation(location)) {
      if (Address.isAddress(location.address)) {
        this.addressControlPO.setValue(location.address);
      }
      if (GeoPoint.isGeoPoint(location.geoPoint)) {
        this.geoPointControlPO.setValue(location.geoPoint);
      }
    }
  }

  expectValue(location: Location) {
    if (Location.isLocation(location)) {
      if (Address.isAddress(location.address)) {
        this.addressControlPO.expectValue(location.address);
      }
      if (GeoPoint.isGeoPoint(location.geoPoint)) {
        this.geoPointControlPO.expectValue(location.geoPoint);
      }
    }
  }
}
