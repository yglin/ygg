import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class TreasureEditPageObjectCypress extends PageObjectCypress {
  selectors = {
    main:'.treasure-edit'
  };
}