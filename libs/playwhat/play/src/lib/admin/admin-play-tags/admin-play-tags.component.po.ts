import { PageObject } from '@ygg/shared/infra/test-utils';
import { tick } from '@angular/core/testing';

export class AdminPlayTagsPageObject extends PageObject {
  selector = '.admin-play-tags';
  selectors = {
    searchInput: 'input.search',
    removeButton: 'button.remove-tags',
    addTagButton: 'button.add-new-tag',
    saveButton: 'button.save-selected',
    unselectedTags: '#items-left'
  };

  tagSelector(tagName: string) {
    return `${this.getSelector('unselectedTags')} [name="${tagName}"]`;
  }

  async searchTag(tagName: string) {
    await this.tester.inputText(this.getSelector('searchInput'), tagName);
    this.tester.expectVisible(this.tagSelector(tagName), true);
  }

  async expectTag(tagName: string) {
    await this.searchTag(tagName);
  }

  async expectNoTag(tagName: string) {
    await this.tester.inputText(this.getSelector('searchInput'), tagName);
    this.tester.expectVisible(this.tagSelector(tagName), false);
  }

  async selectTag(tagName: string) {
    await this.searchTag(tagName);
    this.tester.getElement(this.tagSelector(tagName)).click();
    await this.tester.wait();
  }

  async addNewTag(tagName: string) {
    await this.tester.inputText(this.getSelector('searchInput'), tagName);
    this.tester.clickButton(this.getSelector('addTagButton'));
    await this.tester.wait();
  }

  async removeTag(tagName: string) {
    await this.selectTag(tagName);
    this.tester.clickButton(this.getSelector('removeButton'));
  }

  async savePlayTags() {
    this.tester.clickButton(this.getSelector('saveButton'));
    await this.tester.wait();
  }
}