import { PageObject } from '@ygg/shared/test/page-object';

export abstract class MyBoxesPageObject extends PageObject {
  selectors = {
    main: '.my-boxes'
  };
}
