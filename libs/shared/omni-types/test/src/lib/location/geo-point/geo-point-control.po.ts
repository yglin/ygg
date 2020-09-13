import { GeoPointControlPageObject } from '@ygg/shared/omni-types/ui';
import { GeoPoint } from '@ygg/shared/geography/core';
import { round } from 'lodash';

export class GeoPointControlPageObjectCypress extends GeoPointControlPageObject {
  setValue(geoPoint: GeoPoint): void {
    cy.get(this.getSelector('inputLatitude'))
      .clear()
      .type(round(geoPoint.latitude, 5).toString());
    cy.get(this.getSelector('inputLongitude'))
      .clear()
      .type(round(geoPoint.longitude, 5).toString());
  }
}
