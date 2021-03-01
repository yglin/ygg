import { GeoPoint } from '@ygg/shared/geography/core';
import { round } from 'lodash';
import { ViewPageObject } from '@ygg/shared/test/page-object';

export class GeoPointViewPageObjectCypress extends ViewPageObject {
  selectors = {
    main: '.geo-point-view',
    coordinates: '.coordinates'
  };

  expectValue(geoPoint: GeoPoint): void {
    cy.get(this.getSelector('coordinates')).contains(
      `${round(geoPoint.latitude, 5).toString()}, ${round(
        geoPoint.longitude,
        5
      ).toString()}`
    );
  }
}
