import { PageObject } from '@ygg/shared/test/page-object';
import { Play } from '../play';

export class PlaySelectorPageObject extends PageObject {
  selectors = {
    main: '.play-selector'
  };

  getSelectorForPlay(play: Play) {
    return `${this.getSelector()} [play-id="${play.id}"]`;
  }
}