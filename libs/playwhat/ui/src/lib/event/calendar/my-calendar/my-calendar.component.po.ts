import { PageObject } from '@ygg/shared/test/page-object';

export abstract class MyCalendarPageObject extends PageObject {
  selectors = {
    main:'.my-calendar'
  };
}
