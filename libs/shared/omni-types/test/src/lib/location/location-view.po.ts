import { LocationViewPageObject } from '@ygg/shared/omni-types/ui';
import { AddressViewPageObjectCypress } from './address';
import { GeoPointViewPageObjectCypress } from './geo-point/geo-point-view.po';

export class LocationViewPageObjectCypress extends LocationViewPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.addressViewPO = new AddressViewPageObjectCypress(
      this.getSelector('address')
    );
    this.geoPointViewPO = new GeoPointViewPageObjectCypress(
      this.getSelector('geoPoint')
    );
  }
}
