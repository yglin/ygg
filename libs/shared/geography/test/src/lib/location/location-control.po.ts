import { Location, Address, GeoPoint } from '@ygg/shared/geography/core';
import { ControlPageObject } from '@ygg/shared/test/page-object';
import { AddressControlPageObjectCypress } from './address';
import { GeoPointControlPageObjectCypress } from './geo-point';

export class LocationControlPageObjectCypress extends ControlPageObject {
  selectors = {
    main: '.location-control',
    address: '.address',
    geoPoint: '.geo-point'
  };
  addressControlPO: AddressControlPageObjectCypress;
  geoPointControlPO: GeoPointControlPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.addressControlPO = new AddressControlPageObjectCypress(
      this.getSelector('address')
    );
    this.geoPointControlPO = new GeoPointControlPageObjectCypress(
      this.getSelector('geoPoint')
    );
  }

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

  expectHint(hintMessage: string) {
    cy.get(this.getSelector('address')).contains(hintMessage);
  }
}
