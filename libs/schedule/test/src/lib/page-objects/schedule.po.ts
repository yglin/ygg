import { SchedulePageObject } from '@ygg/schedule/ui';
import { Schedule, ServiceEvent } from '@ygg/schedule/core';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { DateRange, DayTimeRange } from '@ygg/shared/omni-types/core';
import * as moment from 'moment';

export class SchedulePageObjectCypress extends SchedulePageObject {
  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  expectSchedule(schedule: Schedule) {
    this.expectDateRange(DateRange.fromTimeRange(schedule.timeRange));
    this.expectDayTimeRange(schedule.dayTimeRange);
    cy.wrap(schedule.events).each((event: ServiceEvent) => {
      if (schedule.isEventInSchedule(event)) {
        this.expectEventInTimeSlot(event, event.timeRange.start);
      } else {
        this.expectEventInPool(event);
      }
    });
  }

  expectEventInPool(event: ServiceEvent) {
    cy.get(this.getSelectorForPoolEvent(event)).should('be.visible');
  }

  expectEventInTimeSlot(event: ServiceEvent, time: Date) {
    const timeAlignedHalfHour = new Date(time);
    time.setMinutes(time.getMinutes() >= 30 ? 30 : 0);
    cy.get(this.getSelectorForTimeSlot(time))
      .find(`[event-name="${event.name}"]`)
      .should('be.visible');
  }

  expectDateRange(dateRange: DateRange) {
    dateRange.forEachDay((date, index) => {
      cy.get(
        `${this.getSelector()} .time-table .date-axis .date-name[dayIndex="${index}"]`
      ).should('include.text', moment(date).format('M/D ddd'));
    });
  }

  expectDayTimeRange(dayTimeRange: DayTimeRange) {
    const dayTimeRangeAligned = dayTimeRange.alignHalfHour();
    const timeLength = dayTimeRangeAligned.getLength();
    const countTimeSlots = Math.ceil(timeLength / 30);
    cy.get(`${this.getSelector()} .day-time-name`).should(
      'have.length',
      countTimeSlots
    );
    let dayTimeIterator =
      dayTimeRangeAligned.start.hour * 60 +
      (dayTimeRangeAligned.start.minute >= 30 ? 30 : 0);
    for (let index = 0; index < countTimeSlots; index++) {
      const hour = Math.floor(dayTimeIterator / 60)
        .toString()
        .padStart(2, '0');
      const minute = (dayTimeIterator % 60).toString().padStart(2, '0');
      cy.get(
        `${this.getSelector()} .time-slots .day-time-name[index="${index}"]`
      ).should('include.text', `${hour}:${minute}`);
      dayTimeIterator += 30;
    }
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click();
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm('行程安排完成，送出此行程表？');
  }
}
