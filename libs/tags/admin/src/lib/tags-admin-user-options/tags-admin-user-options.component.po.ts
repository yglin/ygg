import { PageObject } from "@ygg/shared/test/page-object";
import { Tag, TaggableType } from '@ygg/tags/core';

export abstract class TagsAdminUserOptionsPageObject extends PageObject {
  selectors = {
    main: '.tags-admin-user-options',
    tagsAll: '.items-left',
    tagInTagsAll: '.items-left .item',
    taggableTypeSelector: '.taggable-type select',
    taggableTypeOptions: '.taggable-type option',
    userOptionTags: '.items-right .item',
    buttonAddToUserOptionTags: 'button#move-to-right',
    buttonRemoveUserOptionTags: 'button#move-to-left',
    inputSearch: 'input.search',
    buttonSaveUserOptionTags: 'button.save-user-option-tags'
  };

  getSelectorForTaggableTypeOption(taggableType: TaggableType): string {
    return `${this.getSelector('taggableTypeOptions')}[value="${taggableType.id}"]`;
  }

  getSelectorForTag(tag: Tag): string {
    return `${this.getSelector('tagInTagsAll')}[item-id="${tag.id}"]`
  }

  getSelectorForUserOptionTag(tag: Tag): string {
    return `${this.getSelector('userOptionTags')}[item-id="${tag.id}"]`
  }

  abstract expectTaggableTypes(taggableTypes: TaggableType[]): any;
  abstract selectTaggableType(taggableType: TaggableType): any;
  abstract expectUserOptionTags(tags: Tag[]): any;
  abstract searchTag(tag: Tag): any;
  abstract expectTagsAll(tags: Tag[]): any;
  abstract selectTags(tags: Tag[]): any;
  abstract addSelectedToUserOptionTags(): any;
  abstract selectUserOptionTags(tags: Tag[]): any;
  abstract removeSelectedFromUserOptionTags(): any;
  abstract saveUserOptionTags(): any;
}