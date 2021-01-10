import { LocationControlPageObject } from '@ygg/shared/omni-types/ui';
import { AddressControlPageObjectCypress } from './address';
import { GeoPointControlPageObjectCypress } from './geo-point';

export class LocationControlPageObjectCypress extends LocationControlPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.addressControlPO = new AddressControlPageObjectCypress(
      this.getSelector('address')
    );
    this.geoPointControlPO = new GeoPointControlPageObjectCypress(
      this.getSelector('geoPoint')
    );
  }

  expectHint(hintMessage: string) {
    cy.get(this.getSelector('address')).contains(hintMessage);
  }
}
