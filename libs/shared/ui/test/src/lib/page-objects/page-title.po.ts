import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class PageTitlePageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.page-title'
  };

  expectText(text: string) {
    cy.get(`${this.getSelector()} .title`).should('include.text', text);
  }
}
