import { PageObject } from '@ygg/shared/test/page-object';

export abstract class SchedulePlanViewPagePageObject extends PageObject {
  selectors = {
    'main': '.ygg-schedule-plan-view-page',
    'buttonEdit': 'button.edit'
  }

  abstract gotoEdit(): any;
  abstract createSchedule(): any;
}