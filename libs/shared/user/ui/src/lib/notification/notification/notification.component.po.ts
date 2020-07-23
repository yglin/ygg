import { PageObject } from '@ygg/shared/test/page-object';

export abstract class NotificationPageObject extends PageObject {
  selectors = {
    main:'.notification'
  };
}
