import { PageObject } from '@ygg/shared/test/page-object';

export abstract class BoxCreatePageObject extends PageObject {
  selectors = {
    main: '.box-create'
  };
}
