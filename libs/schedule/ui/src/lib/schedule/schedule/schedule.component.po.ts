import { PageObject } from '@ygg/shared/test/page-object';
import { Schedule, ServiceEvent } from '@ygg/schedule/core';
import { String, extend } from 'lodash';
import { DateRange, DayTimeRange } from '@ygg/shared/omni-types/core';

export abstract class SchedulePageObject extends PageObject {
  selectors = {
    main: '.schedule-page',
    buttonSubmit: 'button.submit',
    eventPool: '.event-pool',
    timeSlots: '.time-slots'
  };

  dateRange: DateRange;
  dayTimeRange: DayTimeRange;

  constructor(
    parentSelector: string,
    options?: { dateRange: DateRange; dayTimeRange: DayTimeRange }
  ) {
    super(parentSelector);
    extend(this, options);
  }

  getSelectorForEvent(eventName: ServiceEvent | string): string {
    if (typeof eventName !== 'string' && eventName.name) {
      eventName = eventName.name;
    }
    return `${this.getSelector()} [event-name="${eventName}"]`;
  }

  getSelectorForPoolEvent(event: ServiceEvent): string {
    return `${this.getSelector('eventPool')} [event-name="${event.name}"]`;
  }

  getSelectorForTimeSlot(time: Date): string {
    return `${this.getSelector('timeSlots')} [time="${time.valueOf()}"]`;
  }

  getSelectorForTimeSlotDroppable(time: Date): string {
    return `${this.getSelectorForTimeSlot(time)} .drop`;
  }

  getSelectorForTimeSlotAvailability(time: Date): string {
    return `${this.getSelectorForTimeSlot(time)} .availability h4`;
  }

  abstract expectVisible(): any;
  abstract expectSchedule(schedule: Schedule): any;
  abstract submit();
}
