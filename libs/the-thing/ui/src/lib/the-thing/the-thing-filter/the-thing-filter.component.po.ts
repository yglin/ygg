import { PageObject } from '@ygg/shared/test/page-object';
import { TheThingFilter } from '@ygg/the-thing/core';

export abstract class TheThingFilterPageObject extends PageObject {
  selectors = {
    main: '.the-thing-filter',
    inputSearchName: '.search-name input',
    inputFilterName: '.filter-name input',
    buttonSave: 'button.save',
    buttonLoad: 'button.load'
  };

  abstract expectFilter(filter: TheThingFilter): void
  abstract setFilter(filter: TheThingFilter): void;
}
