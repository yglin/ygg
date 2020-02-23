import { PageObject } from '@ygg/shared/test/page-object';
import { DayTime } from '@ygg/shared/omni-types/core';
export abstract class DayTimeControlPageObject extends PageObject {
  selectors = {
    main: '.day-time-control',
    inputHour: 'input#hour',
    inputMinute: 'input#minute'
  };

  abstract setValue(dayTime: DayTime): void;
  abstract expectValue(dayTime: DayTime): void;
}