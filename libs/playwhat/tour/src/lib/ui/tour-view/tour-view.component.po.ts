import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing } from '@ygg/the-thing/core';

export class PlayCardPageObject extends PageObject {
  selectors = {
    main: '.play-card',
  };
}

export class TourViewPageObject extends PageObject {
  selectors = {
    main: '.tour-view',
    name: '.name',
    owner: '.owner',
    note: '.note',
    contacts: '.contacts'
  };

  getSelectorForPlay(play: TheThing): string {
    return `${this.getSelector()} [play-id=${play.id}]`;
  }
}
