import { PageObject } from '@ygg/shared/test/page-object';
import { TheThingFinderPageObject } from '../the-thing-finder/the-thing-finder.component.po';
import { TheThingImitation, TheThing } from '@ygg/the-thing/core';
import { ImageThumbnailListPageObject } from '@ygg/shared/ui/widgets';

export abstract class MyThingsPageObject extends PageObject {
  selectors = {
    main: '.my-things',
    buttonApplyImitation: 'button.apply-imitation'
  };
  theThingListPO: ImageThumbnailListPageObject;

  abstract applyImitation(selection: TheThing[], imitation: TheThingImitation): void;
}
