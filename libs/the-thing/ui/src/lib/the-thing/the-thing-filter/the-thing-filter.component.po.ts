import { PageObject } from '@ygg/shared/test/page-object';

export class TheThingFilterPageObject extends PageObject {
  selectors = {
    main: '.the-thing-filter',
    inputSearchName: '.search-name input',
    inputFilterName: '.filter-name input',
    buttonSave: 'button.save',
    buttonLoad: 'button.load'
  };
}
