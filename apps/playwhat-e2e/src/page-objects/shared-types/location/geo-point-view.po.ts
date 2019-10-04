import { PageObject } from '@ygg/shared/test/page-object';
import { GeoPoint } from '@ygg/shared/types';

export class GeoPointViewPageObjectCypress extends PageObject {
  selectors = {
    main: '.geo-point-view',
    coordinates: '.coordinates'
  };

  expectValue(geoPoint: GeoPoint) {
    cy.get(this.getSelector('coordinates')).contains(`${geoPoint.latitude}, ${geoPoint.longitude}`);
  }
}