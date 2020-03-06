import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing } from '@ygg/the-thing/core';
import { AlbumViewPageObject } from '@ygg/shared/omni-types/ui';

export abstract class PlayViewPageObject extends PageObject {
  selectors = {
    main: '.play-view',
    name: '.name',
    subtitle: '.subtitle',
    album: '.album',
    price: '.price',
    timeLength: '.time-length',
    limitOnNumber: '.limit-on-number',
    additionList: '.addition-list'
  };
  albumViewPO: AlbumViewPageObject;

  abstract expectVisible(): void;
  abstract expectValue(play: TheThing): void;
}
