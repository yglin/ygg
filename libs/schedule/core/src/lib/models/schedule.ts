import { Entity, generateID } from '@ygg/shared/infra/core';
import { Service } from './service';
import { DateRange, TimeRange } from '@ygg/shared/omni-types/core';
import { ServiceEvent } from './event';
import { extend } from 'lodash';

export class Schedule implements Entity {
  id: string;
  events: ServiceEvent[] = [];
  timeRange: TimeRange;
  options: {
    allowDuplicateService?: boolean;
    allowOverlappingEvents?: boolean;
  } = {};

  constructor(timeRange: TimeRange, options?: any) {
    this.id = generateID();
    this.timeRange = timeRange;
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
    const lastEventEnd: Date = this.getEndTime();
    event.setTimeRange(lastEventEnd);
    this.events.push(event);
  }

  getEndTime(): Date {
    let lastEventEnd = this.timeRange.start;
    for (const event of this.events) {
      if (lastEventEnd < event.timeRange.end) {
        lastEventEnd = new Date(event.timeRange.end);
      }
    }
    return lastEventEnd;
  }
}
