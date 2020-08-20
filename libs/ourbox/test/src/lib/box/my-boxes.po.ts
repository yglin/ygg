import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class MyBoxesPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.my-boxes'
  };
}
