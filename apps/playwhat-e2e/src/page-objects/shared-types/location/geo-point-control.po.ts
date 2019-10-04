import { PageObject } from '@ygg/shared/test/page-object';
import { GeoPoint } from '@ygg/shared/types';

export class GeoPointControlPageObjectCypress extends PageObject {
selectors = {
    main: '.geo-point-control',
    label: '.label',
    inputLatitude: 'input#latitude',
    inputLongitude: 'input#longitude'
  };

  setValue(geoPoint: GeoPoint) {
    cy.get(this.getSelector('inputLatitude')).clear().type(geoPoint.latitude.toString());
    cy.get(this.getSelector('inputLongitude')).clear().type(geoPoint.longitude.toString());
  }
}