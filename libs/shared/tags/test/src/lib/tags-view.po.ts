import { Tags } from '@ygg/shared/tags/core';
import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { ChipsViewPageObjectCypress } from '@ygg/shared/ui/test';

export class TagsViewPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.tags-view'
  };

  chipsViewPO: ChipsViewPageObjectCypress;

  constructor(parentSelector: string = '') {
    super(parentSelector);
    this.chipsViewPO = new ChipsViewPageObjectCypress(this.getSelector());
  }

  expectValue(tags: Tags) {
    this.chipsViewPO.expectValue(tags.getTags());
  }
}
