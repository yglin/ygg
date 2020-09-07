import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThing } from '@ygg/the-thing/core';
import {
  TheThingThumbnailPageObjectCypress,
  TheThingFinderPageObjectCypress
} from '@ygg/the-thing/test';
import { ImitationBox } from '@ygg/ourbox/core';

export class MyBoxesPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.my-boxes',
    boxFinder: '.box-finder'
  };

  theThingFinderPO: TheThingFinderPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.theThingFinderPO = new TheThingFinderPageObjectCypress(
      this.getSelector('boxFinder'),
      ImitationBox
    );
  }

  getSelectorForBox(box: TheThing): string {
    return `${this.getSelector()} .box:contains("${box.name}")`;
  }

  gotoBox(box: TheThing) {
    this.theThingFinderPO.searchName(box.name);
    const boxThumbnailPO = new TheThingThumbnailPageObjectCypress(
      this.getSelectorForBox(box),
      ImitationBox
    );
    boxThumbnailPO.gotoView();
  }
}
