import { PageObject } from '@ygg/shared/test/page-object';
import { DayTime } from '../day-time';

export abstract class DayTimeViewPageObject extends PageObject {
  selectors = {
    main: '.day-time-view'
  }

  abstract expectValue(dayTime: DayTime): void;
}