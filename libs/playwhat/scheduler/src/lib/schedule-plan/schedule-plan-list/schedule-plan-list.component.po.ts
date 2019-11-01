import { PageObject } from '@ygg/shared/test/page-object';
import { SchedulePlan } from '../schedule-plan';

export abstract class SchedulePlanListPageObject extends PageObject {
  selectors = {
    'main': '.ygg-schedule-plans-list'
  }

  getSelectorForSchedulePlan(schedulePlan: SchedulePlan): string {
    return `${this.getSelector()} [schedule-plan-id="${schedulePlan.id}"]`;
  }
}