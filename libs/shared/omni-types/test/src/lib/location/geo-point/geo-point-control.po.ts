import { GeoPointControlPageObject } from '@ygg/shared/omni-types/ui';
import { GeoPoint } from '@ygg/shared/geography/core';

export class GeoPointControlPageObjectCypress extends GeoPointControlPageObject {
  setValue(geoPoint: GeoPoint): void {
    cy.get(this.getSelector('inputLatitude'))
      .clear()
      .type(geoPoint.latitude.toString());
    cy.get(this.getSelector('inputLongitude'))
      .clear()
      .type(geoPoint.longitude.toString());
  }
}
