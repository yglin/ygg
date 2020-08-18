import { Entity, generateID } from '@ygg/shared/infra/core';
import { Service } from './service';
import {
  DateRange,
  TimeRange,
  DayTimeRange,
  DayTime
} from '@ygg/shared/omni-types/core';
import { ServiceEvent } from './event';
import { extend } from 'lodash';
import * as moment from 'moment';
import { ServiceAvailablility } from './availability';
import { Observable } from 'rxjs';

export class Schedule implements Entity {
  static Defaults = {
    dayTimeRange: new DayTimeRange(new DayTime(9, 0), new DayTime(17, 30))
  };

  id: string;
  events: ServiceEvent[] = [];
  timeRange: TimeRange;
  dayTimeRange: DayTimeRange;
  serviceAvailabilities$: {
    [serviceId: string]: Observable<ServiceAvailablility>;
  } = {};
  options: {
    allowDuplicateService: boolean;
    allowOverlappingEvents: boolean;
  } = {
    allowDuplicateService: false,
    allowOverlappingEvents: false
  };

  static isSchedule(value: any): value is Schedule {
    return !!(value && value.timeRange && value.dayTimeRange);
  }

  constructor(
    timeRange: TimeRange,
    options: {
      dayTimeRange?: DayTimeRange;
      allowDuplicateService?: boolean;
      allowOverlappingEvents?: boolean;
    } = {}
  ) {
    this.id = generateID();
    this.timeRange = timeRange;
    this.dayTimeRange = options.dayTimeRange || Schedule.Defaults.dayTimeRange;
    extend(this.options, options);
  }

  addEvent(event: ServiceEvent) {
    if (!this.options.allowDuplicateService) {
      for (const _event of this.events) {
        if (_event.service.id === event.service.id) {
          throw new Error(`${event.service.name} 已在行程之中`);
        }
      }
    }
    // this.arrangeEventStupid(event);
    this.events.push(event);
  }

  stupidSchedule() {
    for (const event of this.events) {
      this.arrangeEventStupid(event);
    }
  }

  arrangeEventStupid(event: ServiceEvent) {
    const nextStartTime: moment.Moment = moment(this.getEndTime()).add(
      30,
      'minute'
    );
    const lastEndDayTime: DayTime = DayTime.fromDate(
      nextStartTime.toDate()
    ).add(event.getTimeLength(), 'minute');
    if (
      lastEndDayTime.isAfter(this.dayTimeRange.end) ||
      lastEndDayTime.isAlreadyNextDay()
    ) {
      nextStartTime.add(1, 'day');
      nextStartTime.set({
        hour: this.dayTimeRange.start.hour,
        minute: this.dayTimeRange.start.minute
      });
      nextStartTime.add(30, 'minute');
    }
    nextStartTime.minute(nextStartTime.minute() >= 30 ? 30 : 0);
    event.moveTo(nextStartTime.toDate());

    // Exceed time frame, pull it off schedule;
    if (
      !this.timeRange.include(event.timeRange) ||
      !this.dayTimeRange.include(event.timeRange)
    ) {
      event.moveTo(new Date(0));
    }
  }

  getEndTime(): Date {
    let lastEventEnd = this.timeRange.start;
    lastEventEnd.setHours(this.dayTimeRange.start.hour);
    lastEventEnd.setMinutes(this.dayTimeRange.start.minute);
    for (const event of this.events) {
      if (
        TimeRange.isTimeRange(event.timeRange) &&
        lastEventEnd < event.timeRange.end
      ) {
        lastEventEnd = new Date(event.timeRange.end);
      }
    }
    return lastEventEnd;
  }

  isEventInSchedule(event: ServiceEvent): boolean {
    if (!this.timeRange.include(event.timeRange)) {
      return false;
    }
    if (!this.dayTimeRange.include(event.timeRange)) {
      return false;
    }
    return true;
  }
}
