import { GeoPoint } from '@ygg/shared/geography/core';
import { round } from 'lodash';
import { ControlPageObject } from '@ygg/shared/test/page-object';

export class GeoPointControlPageObjectCypress extends ControlPageObject {
  selectors = {
    main: '.geo-point-control',
    inputLatitude: 'input#latitude',
    inputLongitude: 'input#longitude'
  };

  expectValue(geoPoint: GeoPoint): void {
    cy.get(this.getSelector('inputLatitude'))
      .invoke('val')
      .should('equal', round(geoPoint.latitude, 5).toString());
    cy.get(this.getSelector('inputLongitude'))
      .invoke('val')
      .should('equal', round(geoPoint.longitude, 5).toString());
  }

  setValue(geoPoint: GeoPoint): void {
    cy.get(this.getSelector('inputLatitude'))
      .clear()
      .type(round(geoPoint.latitude, 5).toString());
    cy.get(this.getSelector('inputLongitude'))
      .clear()
      .type(round(geoPoint.longitude, 5).toString());
    cy.wait(500);
  }
}
