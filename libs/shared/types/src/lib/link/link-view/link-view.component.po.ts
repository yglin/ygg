import { PageObject } from '@ygg/shared/test/page-object';

export class LinkViewPageObject extends PageObject {
  selectors = {
    main: '.link-view',
    link: 'a'
  };
}
