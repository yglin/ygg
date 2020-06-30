import { PageObject } from '@ygg/shared/test/page-object';
import { Schedule, ServiceEvent } from '@ygg/schedule/core';
import { String } from 'lodash';

export abstract class SchedulePageObject extends PageObject {
  selectors = {
    main: '.schedule-page',
    buttonSubmit: 'button.submit',
    eventPool: '.event-pool',
    timeSlots: '.time-slots'
  };

  getSelectorForPoolEvent(event: ServiceEvent): string {
    return `${this.getSelector('eventPool')} [event-name="${event.name}"]`;
  }

  getSelectorForTimeSlot(time: Date): string {
    return `${this.getSelector('timeSlots')} [time="${time.valueOf()}"]`;
  }

  abstract expectVisible(): any;
  abstract expectSchedule(schedule: Schedule): any;
  abstract submit();
}
