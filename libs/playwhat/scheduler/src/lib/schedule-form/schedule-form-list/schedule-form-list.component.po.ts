import { PageObject } from '@ygg/shared/test/page-object';
import { ScheduleForm } from '../schedule-form';

export abstract class ScheduleFormListPageObject extends PageObject {
  selectors = {
    'main': '.ygg-schedule-forms-list'
  }

  getSelectorForScheduleForm(scheduleForm: ScheduleForm): string {
    return `${this.getSelector()} [schedule-form-id="${scheduleForm.id}"]`;
  }
}