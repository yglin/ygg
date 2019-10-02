import { PageObject } from "@ygg/shared/test/page-object";
import { Tag } from '@ygg/tags/core';

export abstract class TagsAdminListPageObject extends PageObject {
  selectors = {
    main: '.tags-admin-list',
    tagsList: '.tags-list',
    tag: '.tag-item',
    inputSearch: 'input.search',
    buttonAddNewTag: 'button.add-new-tag',
    buttonRemoveSelected: 'button.remove-tags',
  };

  getSelectorForTag(tag: Tag) {
    return `${this.getSelector('tag')}[tagId="${tag.id}"]`
  }

  abstract createNewTag(tag: Tag): any;
  abstract expectTags(tags: Tag[]): any;
  abstract expectNotTags(tags: Tag[]): any;
  abstract searchTag(tag: Tag): any;
  abstract expectTagsAll(tags: Tag[]): any;
  abstract selectTags(tags: Tag[]): any;
  abstract removeSelectedTags(): any;
  abstract expectDisabled(elementName: string, flag: boolean): any;
}