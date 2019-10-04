import { TagsViewComponentPageObject } from '@ygg/tags/ui';
import { Tags, Tag} from '@ygg/tags/core';

export class TagsViewPageObjectCypress extends TagsViewComponentPageObject {
  expectValue(tags: Tags) {
    const tagsArray = tags.toTagsArray();
    cy.wrap(tagsArray).each((element, index, array) => {
      cy.get(this.getSelectorForTagChip(tagsArray[index])).contains(tagsArray[index].name);
    });
  }
}