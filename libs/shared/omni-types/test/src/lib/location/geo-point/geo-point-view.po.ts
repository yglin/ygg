import { GeoPointViewPageObject } from '@ygg/shared/omni-types/ui';
import { GeoPoint } from '@ygg/shared/geography/core';
import { round } from 'lodash';

export class GeoPointViewPageObjectCypress extends GeoPointViewPageObject {
  expectValue(geoPoint: GeoPoint): void {
    cy.get(this.getSelector('coordinates')).contains(
      `${round(geoPoint.latitude, 5).toString()}, ${round(
        geoPoint.longitude,
        5
      ).toString()}`
    );
  }
}
