import { GeoPointViewPageObject } from '@ygg/shared/omni-types/ui';
import { GeoPoint } from '@ygg/shared/omni-types/core';

export class GeoPointViewPageObjectCypress extends GeoPointViewPageObject {
  expectValue(geoPoint: GeoPoint): void {
    cy.get(this.getSelector('coordinates')).contains(
      `${geoPoint.latitude}, ${geoPoint.longitude}`
    );
  }
}
