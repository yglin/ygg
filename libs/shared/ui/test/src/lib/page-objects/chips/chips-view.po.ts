import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class ChipsViewPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.chips-view'
  };

  expectValue(chips: string[]) {
    cy.wrap(chips).each((chip: string) => {
      cy.get(`${this.getSelector()} .chip:contains("${chip}")`).should(
        'be.visible'
      );
    });
    cy.get(`${this.getSelector()} .chip`)
      .its('length')
      .should('equal', chips.length);
  }
}
