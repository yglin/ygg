import { SchedulePageObject } from '@ygg/schedule/ui';
import {
  Schedule,
  ServiceEvent,
  ServiceAvailablility
} from '@ygg/schedule/core';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import {
  DateRange,
  DayTimeRange,
  BusinessHours,
  TimeRange
} from '@ygg/shared/omni-types/core';
import * as moment from 'moment';
import * as chroma from 'chroma-js';

export class SchedulePageObjectCypress extends SchedulePageObject {
  expectVisible() {
    cy.get(this.getSelector(), { timeout: 20000 }).should('be.visible');
  }

  expectSchedule(schedule: Schedule) {
    this.expectDateRange(DateRange.fromTimeRange(schedule.timeRange));
    this.expectDayTimeRange(schedule.dayTimeRange);
    cy.wrap(schedule.events).each((event: ServiceEvent) => {
      if (schedule.isEventInSchedule(event)) {
        this.expectEventInTimeSlot(event.name, event.timeRange.start);
      } else {
        this.expectEventInPool(event);
      }
    });
  }

  expectEventInPool(event: ServiceEvent) {
    cy.get(this.getSelectorForPoolEvent(event)).should('be.visible');
  }

  expectEventInTimeSlot(eventName: string, time: Date) {
    const timeAlignedHalfHour = new Date(time);
    time.setMinutes(time.getMinutes() >= 30 ? 30 : 0);
    cy.get(this.getSelectorForTimeSlot(time))
      .find(`[event-name="${eventName}"]`)
      .should('be.visible');
  }

  expectDateRange(dateRange: DateRange) {
    dateRange.forEachDay((date, index) => {
      cy.get(
        `${this.getSelector()} .time-table td.date-name[day-index="${index}"]`
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

  clickOnEvent(name: string) {
    cy.get(this.getSelectorForEvent(name)).click({ force: true });
  }

  moveEvent(name: string, time: Date) {
    cy.get(this.getSelectorForEvent(name))
      .first()
      .trigger('mousedown', 5, 5, { which: 1, force: true })
      .trigger('mousemove', { clientX: 5, clientY: 5, force: true });
      // .trigger('mouseup', { force: true });
    cy.get(this.getSelectorForTimeSlotDroppable(time))
      .first()
      .trigger('mousemove', { clientX: 5, clientY: 5, force: true })
      .trigger('mouseup', { force: true });
  }

  expectBusinessHours(
    businessHours: BusinessHours,
    color: string,
    capacity: number
  ) {
    // console.log(businessHours);
    this.dateRange.forEachDay((date, index) => {
      const timeRange = this.dayTimeRange.toTimeRange(date);
      // console.log(timeRange);
      timeRange.forEachHalfHour((halfHour: TimeRange) => {
        if (businessHours.include(halfHour)) {
          cy.get(this.getSelectorForTimeSlot(halfHour.start)).should(
            'have.css',
            'background-color',
            chroma(color)
              .alpha(0.25)
              .css()
              .replace(/,/g, ', ')
          );
          cy.get(this.getSelectorForTimeSlot(halfHour.start)).should(
            'include.text',
            capacity.toString()
          );
        } else {
          cy.get(this.getSelectorForTimeSlot(halfHour.start)).should(
            'have.css',
            'background-color',
            chroma('white')
              .alpha(0.25)
              .css()
              .replace(/,/g, ', ')
          );
        }
      });
    });
  }

  expectAvailability(serviceAvailablility: ServiceAvailablility) {
    this.dateRange.forEachDay(date => {
      const timeRange: TimeRange = this.dayTimeRange.toTimeRange(date);
      timeRange.forEachHalfHour(halfHour => {
        const availability: number = serviceAvailablility.getSingleAvailability(
          halfHour
        );
        if (availability > 0) {
          cy.get(
            this.getSelectorForTimeSlotAvailability(halfHour.start)
          ).should('include.text', availability.toString());
        }
      });
    });
  }
}
