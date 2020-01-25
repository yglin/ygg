import { PageObject } from '@ygg/shared/test/page-object';
import { DateRange } from '@ygg/shared/omni-types/core';

export class DateRangeViewPageObject extends PageObject {
  selectors= {
    main: '.date-range-view',
    start: '.start',
    end: '.end'
  };
}