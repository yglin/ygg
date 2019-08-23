import { ViewPageObject, Tester } from '@ygg/shared/infra/test-utils';
import { Address } from '../address';
import { AddressViewComponentPageObject } from '../address/index.spec';
import { GeoPoint } from '../geo-point';
import { GeoPointViewComponentPageObject } from '../geo-point/index.spec';
import { Location } from '../location';

export class LocationViewComponentPageObject extends ViewPageObject<Location> {
  selector = '.location-view'
  selectors = {};
  addressView: AddressViewComponentPageObject;
  geoPointView: GeoPointViewComponentPageObject;

  constructor(tester: Tester, parentSelecter: string = '') {
    super(tester, parentSelecter);
    this.addressView = new AddressViewComponentPageObject(tester, this.getSelector());
    this.geoPointView = new GeoPointViewComponentPageObject(tester, this.getSelector());
  }

  expectValue(location: Location) {
    if (Location.isLocation(location)) {
      if (Address.isAddress(location.address)) {
        this.addressView.expectValue(location.address);
      }
      if (GeoPoint.isGeoPoint(location.geoPoint)) {
        this.geoPointView.expectValue(location.geoPoint);
      }
    }
  }
}

