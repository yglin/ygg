import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { ChipsControlPageObjectCypress } from '@ygg/shared/ui/test';
import { Tags } from '@ygg/shared/tags/core';

export class TagsControlPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.tags-control'
  };

  chipsControlPO: ChipsControlPageObjectCypress;

  constructor(parentSelector: string = '') {
    super(parentSelector);
    this.chipsControlPO = new ChipsControlPageObjectCypress(this.getSelector());
  }

  setValue(tags: Tags) {
    this.chipsControlPO.setValue(tags.getTags());
  }

  clearValue() {
    this.chipsControlPO.clear();
  }

  expectTags(tags: string[]) {
    this.chipsControlPO.expectValue(tags);
  }

  expectTopTags(topTags: string[]) {
    cy.wait(1000);
    this.chipsControlPO.expectAutocompleteOptions(
      topTags.map(tag => tag.toLowerCase())
    );
  }
}
