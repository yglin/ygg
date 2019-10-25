import { PageObject } from '@ygg/shared/test/page-object';

export abstract class PlayListPageObject extends PageObject {
  selectors = {
    main: '.ygg-play-list'
  }
}