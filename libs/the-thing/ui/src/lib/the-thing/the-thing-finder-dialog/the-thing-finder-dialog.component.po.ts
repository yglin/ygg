import { PageObject } from '@ygg/shared/test/page-object';
import { TheThingFinderPageObject } from '../the-thing-finder/the-thing-finder.component.po';
import { TheThing } from '@ygg/the-thing/core';

export class TheThingFinderDialogPageObject extends PageObject {
  selectors = {
    main: '.the-thing-finder-dialog',
    buttonSubmit: 'button.submit'
  };
  theThingFinder: TheThingFinderPageObject;

  select(theThing: TheThing) {
    this.theThingFinder.select(theThing);
  }
}
