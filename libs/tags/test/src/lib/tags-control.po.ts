import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { Tag, Tags } from '@ygg/tags/core';
import { ChipsControlPageObjectCypress } from '@ygg/shared/ui/test';

export class TagsControlPageObjectCypress extends PageObjectCypress {
  chipsControlPO: ChipsControlPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.chipsControlPO = new ChipsControlPageObjectCypress(this.getSelector());
  }

  selectors = {
    main: '.tags-control',
    topTags: '.top-tags'
  };

  getSelectorForTopTag(tag: string): string {
    return `${this.getSelector('topTags')} .tag:contains("${tag}")`;
  }

  setValue(tags: Tags) {
    this.chipsControlPO.setValue(tags.tags);
  }

  deleteTag(tag: string) {
    this.chipsControlPO.deleteChip(tag);
  }

  addTag(tag: string) {
    this.chipsControlPO.addChip(tag);
  }

  expectTopTags(tags: string[]) {
    cy.get(`${this.getSelector('topTags')} .title`).should(
      'include.text',
      '熱門標籤'
    );
    cy.get(`${this.getSelector('topTags')} .tag`).should(
      'have.length',
      tags.length
    );
    cy.wrap(tags).each((tag: string) => this.expectTopTag(tag));
  }

  expectTopTag(tag: string) {
    cy.get(this.getSelectorForTopTag(tag))
      .scrollIntoView()
      .should('be.visible');
  }

  expectNoTopTag(tag: string) {
    cy.get(this.getSelectorForTopTag(tag)).should('not.be.visible');
  }

  clickTopTag(tag: string) {
    cy.get(this.getSelectorForTopTag(tag)).click();
  }
}
