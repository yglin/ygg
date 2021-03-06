import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing, TheThingImitation, TheThingCell } from '@ygg/the-thing/core';
import { ImageThumbnailItemPageObject } from '@ygg/shared/ui/widgets';

export abstract class TheThingThumbnailPageObject extends PageObject {
  selectors = {
    main: '.the-thing-thumbnail'
  };
  imitation: TheThingImitation;

  constructor(parentSelector: string, imitation: TheThingImitation) {
    super(parentSelector);
    this.imitation = imitation;
  }

  getSelectorForCell(cellId: string): string {
    return `${this.getSelector()} [cell-id="${cellId}"]`;
  }

  abstract expectValue(theThing: TheThing): void;
}
