import { PageObject } from '@ygg/shared/test/page-object';
import { Tags, Tag } from '@ygg/tags/core';

export abstract class TagsViewComponentPageObject extends PageObject {
  selectors = {
    main: '.tags-view',
    tagChip: '.tag-chip'
  };

  getSelectorForTagChip(tag: Tag): string {
    return `${this.getSelector('tagChip')}[tagName="${tag.name}"]`;
  }

  abstract expectValue(tags: Tags): any;
  
}