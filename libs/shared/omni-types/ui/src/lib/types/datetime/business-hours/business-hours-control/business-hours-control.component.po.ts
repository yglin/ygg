import { BusinessHours } from '@ygg/shared/omni-types/core';
import { ControlPageObject } from '@ygg/shared/test/page-object';

export abstract class BusinessHoursControlPageObject extends ControlPageObject {
  selectors = {
    main: '.business-hours-control',
    buttonClearAll: 'button.clear-all',
    openHour: '.open-hour',
    selectWeekday: '.select-weekday',
    buttonAdd: 'button.add-open-hour',
    buttonSubtract: 'button.subtract-open-hour',
    inputDayTimeRange: '.day-time-range-control'
  };
}
