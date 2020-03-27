import { PageObject } from '@ygg/shared/test/page-object';
import { Location, Address, GeoPoint } from '@ygg/shared/omni-types/core';
import { AddressControlPageObject } from '../address';
import { GeoPointControlPageObject } from '../geo-point/geo-point-control/geo-point-control.component.po';

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
}
