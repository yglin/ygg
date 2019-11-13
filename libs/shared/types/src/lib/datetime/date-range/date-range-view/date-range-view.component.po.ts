import { PageObject } from '@ygg/shared/test/page-object';
import { DateRange } from '../date-range';

export class DateRangeViewPageObject extends PageObject {
  selectors= {
    main: '.date-range-view',
    start: '.start',
    end: '.end'
  };
}