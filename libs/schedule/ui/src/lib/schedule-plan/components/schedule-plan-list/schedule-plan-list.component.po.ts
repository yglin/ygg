import { PageObject } from '@ygg/shared/test/page-object';
import { SchedulePlan } from '@ygg/schedule/core';

export abstract class SchedulePlanListPageObject extends PageObject {
  selectors = {
    'main': '.ygg-schedule-plan-list'
  }

  getSelectorForSchedulePlan(schedulePlan: SchedulePlan): string {
    return `${this.getSelector()} [schedule-plan-id="${schedulePlan.id}"]`;
  }
}