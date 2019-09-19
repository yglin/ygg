import { PageObjects } from '@ygg/shared/infra/test-utils';
import { Tags, Tag } from '@ygg/playwhat/tag';

export class TagsControlPageObject extends PageObjects.ControlPageObject<Tags> {
  selector = '.tags-control';
  selectors = {
    label: '.label',
    inputTagName: 'input#tag-name',
    buttonAdd: 'button#add-tag',
    buttonClear: 'button#clear-all',
    tagChip: '.tag-chip',
    autocompleteDropdown: '.autocomplete-panel'
  };

  getTagChip(name: string) {
    return `${this.getSelector('tagChip')}[tagName="${name}"]`;
  }

  clear() {
    cy.get(this.getSelector('buttonClear')).click();
    cy.get(this.getSelector('tagChip')).should('not.exist');
  }

  addTag(tag: Tag) {
    cy.get(this.getSelector('inputTagName')).type(tag.name);
    cy.get(this.getTagChip(tag.name)).should('be.visible');
  }

  setValue(tags: Tags) {
    this.clear();
    for (const tag of tags.toTagsArray()) {
      this.addTag(tag);
    }
  }
}

export class TagsViewComponentPageObject extends PageObjects.ViewPageObject<Tags> {
  selector = '.tags-view';
  selectors = {
    tagChip: '.tag-chip'
  };

  getTagChip(name: string) {
    return `${this.getSelector('tagChip')}[tagName="${name}"]`;
  }

  expectTag(tag: Tag) {
    cy.get(this.getTagChip(tag.name)).should('be.visible');
  }

  expectValue(tags: Tags) {
    const tagsArray = tags.toTagsArray();
    cy.wrap(tagsArray).each((element, index, array) => {
      this.expectTag(tagsArray[index]);
    });
  }
}