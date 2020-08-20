import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class MapSearchPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.map-search'
  };
}
