import { PageObject } from "@ygg/shared/test/page-object";
import { DateRange } from '@ygg/shared/omni-types/core';

export abstract class DateRangeControlPageObject extends PageObject {
  selectors = {
    main: '.ygg-date-range-control',
    inputStart: 'input.start',
    inputEnd: 'input.end'
  }
  abstract setValue(dateRange: DateRange): any;
}

