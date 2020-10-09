import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { Tags } from '@ygg/tags/core';

export class TagsViewPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.tags-view',
    tagChip: '.tag-chip'
  };

  expectValue(tags: Tags) {
    cy.get(this.getSelector('tagChip')).should('have.length', tags.length);
    cy.wrap(tags.tags).each((tagName: string) => this.expectTag(tagName));
  }

  expectTag(tag: string) {
    cy.get(`${this.getSelector('tagChip')}:contains("${tag}")`).should(
      'be.visible'
    );
  }

  expectNoTag(tag: string) {
    cy.get(`${this.getSelector('tagChip')}:contains("${tag}")`).should(
      'not.be.visible'
    );
  }
}
