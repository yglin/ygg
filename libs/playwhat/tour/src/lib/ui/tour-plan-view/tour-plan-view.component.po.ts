import { PageObject } from '@ygg/shared/test/page-object';

export class TourPlanViewPageObject extends PageObject {
  selectors = {
    main: '.tour-plan-view',
    name: '.name',
    dateRange: '.date-range',
    dayTimeRange: '.day-time-range'
  };
}
