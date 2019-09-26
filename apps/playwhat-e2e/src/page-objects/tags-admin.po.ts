import { PageObjects } from '@ygg/shared/infra/test-utils';
import { Tag, Tags } from '@ygg/playwhat/tag';

export class TagsAdminUserOptionsPageObject extends PageObjects.PageObject {
  selector = '.tags-admin';
  selectors = {
    main: '.tags-admin',
    searchInput: 'input.search',
    removeButton: 'button.remove-tags',
    addTagButton: 'button.add-new-tag',
    saveButton: 'button.save-selected',
    tagsBucket: '#tags-bucket'
  };

  searchInTagsBucket(tag: Tag) {
    cy.get(this.getSelector('searchInput')).type(tag.name);
    cy.get(`${this.getSelector('tagsBucket')} [tagName="${tag.name}"]`);
  }

  expectTag(tag: Tag) {
    this.searchInTagsBucket(tag);
  }

  expectTags(tags: Tags) {
    const tagsArray = tags.toTagsArray();
    cy.wrap(tagsArray).each((element, index, array) =>
      this.expectTag(tagsArray[index])
    );
  }
}
