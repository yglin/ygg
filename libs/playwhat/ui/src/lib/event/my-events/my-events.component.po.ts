import { PageObject } from '@ygg/shared/test/page-object';

export abstract class MyEventsPageObject extends PageObject {
  selectors = {
    main:'.my-events'
  };

  // abstract switchTabMyHostEvents(): void;
  // abstract switchTabMyCalendar(): void;
}