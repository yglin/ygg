import { PageObject } from '@ygg/shared/test/page-object';
import { DayTime } from '../day-time';

export abstract class DayTimeControlPageObject extends PageObject {
  selectors = {
    main: '.day-time-control',
    inputHour: 'input#hour',
    inputMinute: 'input#minute'
  };

  abstract setValue(dayTime: DayTime): void;
}