import { PageObject } from "@ygg/shared/test/page-object";
import { DateRange } from '../date-range';

export abstract class DateRangePickerPageObject extends PageObject {
  selectors = {
    main: '.ygg-date-range-picker',
    inputStart: 'input.start',
    inputEnd: 'input.end'
  }
  abstract setValue(dateRange: DateRange): any;
}

