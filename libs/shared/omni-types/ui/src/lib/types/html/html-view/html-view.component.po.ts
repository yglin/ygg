import { PageObject } from '@ygg/shared/test/page-object';

export class HtmlViewPageObject extends PageObject {
  selectors = {
    main: '.html-view',
    content: '.content'
  };
}
