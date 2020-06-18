import { PageObject } from '@ygg/shared/test/page-object';
import { Schedule } from '@ygg/schedule/core';

export abstract class SchedulePageObject extends PageObject {
  selectors = {
    main: '.schedule'
  };

  abstract expectVisible(): any;
  abstract expectSchedule(schedule: Schedule): any;
}
