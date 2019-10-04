import { TagsControlComponentPageObject } from '@ygg/tags/ui';
import { Tags, Tag } from '@ygg/tags/core';

export class TagsControlPageObjectCypress extends TagsControlComponentPageObject {

  clear() {
    cy.get(this.getSelector('buttonClear')).click();
    cy.get(this.getSelector('tagChip')).should('not.exist');
  }

  addTag(tag: Tag) {
    cy.get(this.getSelector('inputTagName')).clear().type(tag.name);
    cy.get(this.getSelector('buttonAdd')).click();
    cy.get(this.getSelectorForTagChip(tag)).should('be.visible');
  }

  setValue(tags: Tags) {
    this.clear();
    const tagsArray = tags.toTagsArray();
    cy.wrap(tagsArray).each((element, index, array) => {
      this.addTag(tagsArray[index]);
    });
  }
}
