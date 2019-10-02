import { PageObject } from "@ygg/shared/test/page-object";
import { Tags, Tag } from '@ygg/tags/core';

export abstract class TagsControlComponentPageObject extends PageObject {
  selectors = {
    main: '.tags-control',
    label: '.label',
    inputTagName: 'input#tag-name',
    buttonAdd: 'button#add-tag',
    buttonClear: 'button#clear-all',
    tagChip: '.tag-chip',
  };

  getSelectorForAutocompletePanel(): string {
    return '.autocomplete-panel';
  }

  getSelectorForTagChip(tag: Tag): string {
    return `${this.getSelector('tagChip')}[tagName="${tag.name}"]`;
  }

  getSelectorForTagDeleteButton(tag: Tag): string {
    return `${this.getSelectorForTagChip(tag)} .delete`;
  }

  getSelectorForAutocompleteOption(optionValue: any): string {
    return `${this.getSelectorForAutocompletePanel()} option[value="${optionValue}"]`;
  }

  abstract setValue(tags: Tags): any;
}