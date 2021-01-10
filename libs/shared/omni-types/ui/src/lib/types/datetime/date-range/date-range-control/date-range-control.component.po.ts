import { DateRange } from '@ygg/shared/omni-types/core';
import { ControlPageObject } from '@ygg/shared/test/page-object';

export abstract class DateRangeControlPageObject extends ControlPageObject {
  selectors = {
    main: '.ygg-date-range-control',
    inputStart: 'input.start',
    inputEnd: 'input.end'
  };
  abstract setValue(dateRange: DateRange): any;
}
