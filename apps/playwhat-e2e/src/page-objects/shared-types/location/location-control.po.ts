import { PageObject } from '@ygg/shared/test/page-object';
import { Location, Address, GeoPoint } from '@ygg/shared/types';
import { GeoPointControlPageObjectCypress } from './geo-point-control.po';
import { AddressControlPageObjectCypress } from './address-control.po';

export class LocationControlPageObjectCypress extends PageObject {
  selectors = {
    main: '.location-control',
    label: '.label',
    sliderToggleSync: '#sync-mode input[type="checkbox"]',
    buttonNextGeoPoint: 'button#next-geo-point',    
  };

  addressControl: AddressControlPageObjectCypress;
  geoPointControl: GeoPointControlPageObjectCypress;

  constructor(parentSelector: string = '') {
    super(parentSelector);
    this.addressControl = new AddressControlPageObjectCypress(this.getSelector());
    this.geoPointControl = new GeoPointControlPageObjectCypress(this.getSelector());
  }


  setValue(value: Location) {
    if (Location.isLocation(value)) {
      if (Address.isAddress(value.address)) {
        this.addressControl.setValue(value.address);
      }
      if (GeoPoint.isGeoPoint(value.geoPoint)) {
        this.geoPointControl.setValue(value.geoPoint);
      }
    }
  }
}