import { PageObject } from '@ygg/shared/test/page-object';

export abstract class MapSearchPageObject extends PageObject {
  selectors = {
    main: '.map-search'
  };
}
