import { PageObject } from '@ygg/shared/test/page-object';

export abstract class DateViewPageObject extends PageObject {
  selectors = {
    main: '.date-view'
  };

  abstract expectValue(date: Date): void;
}
