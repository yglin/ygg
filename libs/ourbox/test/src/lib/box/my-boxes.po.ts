import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingThumbnailPageObjectCypress } from '@ygg/the-thing/test';
import { ImitationBox } from '@ygg/ourbox/core';

export class MyBoxesPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.my-boxes'
  };

  getSelectorForBox(box: TheThing): string {
    return `${this.getSelector()} `
  }

  gotoBox(box: TheThing) {
    const boxThumbnailPO = new TheThingThumbnailPageObjectCypress(this.getSelectorForBox(box), ImitationBox);
    boxThumbnailPO.gotoView();
  }
}
