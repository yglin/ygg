import { AddressViewPageObjectCypress } from './address';
import { LocationViewPageObjectCypress } from './location-view.po';
import { Location, Address } from '@ygg/shared/geography/core';

export class LocationViewCompactPageObjectCypress extends LocationViewPageObjectCypress {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.addressViewPO = new AddressViewPageObjectCypress(
      this.getSelector('address')
    );
    this.selectors.buttonShowOnMap = 'button.goto-map';
  }

  expectValue(location: Location) {
    if (Location.isLocation(location)) {
      if (Address.isAddress(location.address)) {
        this.addressViewPO.expectValue(location.address);
      }
    }
  }

  clickShowOnMap() {
    cy.get(this.getSelector('buttonShowOnMap')).scrollIntoView().click();
  }
}
