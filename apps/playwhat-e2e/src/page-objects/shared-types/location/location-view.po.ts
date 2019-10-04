import { PageObject } from '@ygg/shared/test/page-object';
import { Location, Address, GeoPoint } from '@ygg/shared/types';
import { GeoPointViewPageObjectCypress } from './geo-point-view.po';
import { AddressViewPageObjectCypress } from './address-view.po';

export class LocationViewPageObjectCypress extends PageObject {
  selectors = {
    main: '.location-view'
  };
  addressView: AddressViewPageObjectCypress;
  geoPointView: GeoPointViewPageObjectCypress;

  constructor(parentSelecter: string) {
    super(parentSelecter);
    this.addressView = new AddressViewPageObjectCypress(this.getSelector());
    this.geoPointView = new GeoPointViewPageObjectCypress(this.getSelector());
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