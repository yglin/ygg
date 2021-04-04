import { Location, Address, GeoPoint } from '@ygg/shared/geography/core';
import { ViewPageObject } from '@ygg/shared/test/page-object';
import { AddressViewPageObjectCypress } from './address';
import { GeoPointViewPageObjectCypress } from './geo-point/geo-point-view.po';

export class LocationViewPageObjectCypress extends ViewPageObject {
  selectors: any = {
    main: '.location-view',
    address: '.address',
    geoPoint: '.geo-point'
  };
  addressViewPO: AddressViewPageObjectCypress;
  geoPointViewPO: GeoPointViewPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.addressViewPO = new AddressViewPageObjectCypress(
      this.getSelector('address')
    );
    this.geoPointViewPO = new GeoPointViewPageObjectCypress(
      this.getSelector('geoPoint')
    );
  }

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
