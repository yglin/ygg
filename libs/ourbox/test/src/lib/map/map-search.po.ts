import { MapSearchPageObject } from '@ygg/ourbox/ui';

export class MapSearchPageObjectCypress extends MapSearchPageObject {
  expectVisible(options: any) {
    cy.get(this.getSelector(), options).should('be.visible');
  }
}
