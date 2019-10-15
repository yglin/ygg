import { PageObject } from '@ygg/shared/test/page-object';
import { DateRange } from './date-range';

export abstract class DateRangeViewPageObject extends PageObject {
  selectors= {
    main: '.ygg-date-range',
    start: '.start',
    end: '.end'
  };

  abstract expectValue(dateRange: DateRange): any;
}