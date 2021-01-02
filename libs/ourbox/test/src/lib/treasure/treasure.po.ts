import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class TreasurePageObjectCypress extends PageObjectCypress {
  selectors = {
    main:'.treasure'
  };
}