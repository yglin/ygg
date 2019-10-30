import { PageObject } from '@ygg/shared/test/page-object';

export abstract class ScheduleFormViewPagePageObject extends PageObject {
  selectors = {
    'main': '.ygg-schedule-form-view-page',
    'buttonEdit': 'button.edit'
  }

  abstract gotoEdit(): any;
  abstract createSchedule(): any;
}