import { PageObject } from '@ygg/shared/test/page-object';
import { Tags, Tag } from '@ygg/tags/core';

export abstract class TagsControlComponentPageObject extends PageObject {
  selectors = {
    main: '.tags-control',
    label: '.label',
    inputTagName: 'input#chip',
    buttonAdd: 'button#add-chip',
    buttonClear: 'button#clear-all',
    tagChip: '.chip'
  };

  getSelectorForAutocompletePanel(): string {
    return '.autocomplete-panel';
  }

  getSelectorForTagChip(tag?: Tag): string {
    if (tag) {
      return `${this.getSelector('tagChip')}[chipName="${tag.name}"]`;
    } else {
      return `${this.getSelector('tagChip')}`;
    }
  }

  getSelectorForTagDeleteButton(tag?: Tag): string {
    return `${this.getSelectorForTagChip(tag)} .delete`;
  }

  getSelectorForAutocompleteOption(optionValue: any): string {
    return `${this.getSelectorForAutocompletePanel()} option[value="${optionValue}"]`;
  }

  abstract setValue(tags: Tags): any;
}
