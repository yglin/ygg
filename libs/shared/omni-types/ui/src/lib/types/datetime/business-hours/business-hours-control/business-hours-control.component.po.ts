import { OpenHour, BusinessHours } from '@ygg/shared/omni-types/core';
import { PageObject } from '@ygg/shared/test/page-object';

export abstract class BusinessHoursControlPageObject extends PageObject {
  selectors = {
    main: '.business-hours-control',
    buttonClearAll: 'button.clear-all',
    openHour: '.open-hour',
    selectWeekday: '.select-weekday',
    buttonAdd: 'button.add-open-hour',
    buttonSubtract: 'button.subtract-open-hour',
    inputDayTimeRange: '.day-time-range-control'
  };

  abstract setValue(businessHours: BusinessHours): void;
}
