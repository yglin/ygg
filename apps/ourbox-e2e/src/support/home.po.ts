import { PageObject } from '@ygg/shared/test/page-object';

export class HomePageObject extends PageObject {
  gotoBoxCreate() {
    cy.get(this.getSelector('link2Create')).click();
    cy.location().should('match', /.*\/boxes\/create\//);
  }

  gotoMap() {
    cy.get(this.getSelector('link2Map')).click();
    cy.location().should('match', /.*\/map\//);
  }

  selectors = {
    main: '.home'
  };
}
