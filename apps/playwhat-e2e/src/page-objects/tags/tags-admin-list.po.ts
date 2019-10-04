import { TagsAdminListPageObject } from '@ygg/tags/admin';
import { Tag } from '@ygg/tags/core';

export class TagsAdminListPageObjectCypress extends TagsAdminListPageObject {
  expectTags(tags: Tag[]) {
    cy.wrap(tags).each((element, index, array) =>
      cy.get(this.getSelectorForTag(tags[index])).contains(tags[index].name)
    );
  }
}
