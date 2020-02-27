import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing } from '@ygg/the-thing/core';

export abstract class PlayCardPageObject extends PageObject {
  selectors = {
    main: '.play-card',
    name: '.name',
    subtitle: '.subtitle',
    intro: '.intro',
    price: '.price',
    minParticipants: '.min-participants',
    maxParticipants: '.max-participants',
    timeLength: '.time-length',
    album: '.album'
  };

  abstract expectValue(play: TheThing): void
}

