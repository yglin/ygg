import { Service } from './service';
import { Entity, generateID, hashStringToColor } from '@ygg/shared/infra/core';
import { TimeRange } from '@ygg/shared/omni-types/core';
import * as moment from 'moment';

export class ServiceEvent implements Entity {
  id: string;
  name: string;
  image: string;
  service: Service;
  timeRange: TimeRange;
  numParticipants: number;

  get color(): string {
    return this.service.color;
  }

  moveTo = this.setTimeRange;

  constructor(
    service: Service,
    options: {
      id?: string;
      numParticipants?: number;
      timeRange?: TimeRange;
    } = {}
  ) {
    this.id = options.id || generateID();
    this.name = service.name;
    this.image = service.image;
    this.service = service;
    this.numParticipants = options.numParticipants || 0;
    if (TimeRange.isTimeRange(options.timeRange)) {
      this.timeRange = options.timeRange;
    } else {
      const timeLength = Math.max(30, this.service.timeLength);
      const start = new Date();
      const end = moment(start)
        .add(timeLength, 'minute')
        .toDate();
      this.timeRange = new TimeRange(start, end);
    }
  }

  setTimeRange(start: Date, end?: Date) {
    if (!end) {
      end = moment(start)
        .add(this.service.timeLength, 'minutes')
        .toDate();
    }
    this.timeRange = new TimeRange(start, end);
  }

  getServieTimeLength(): number {
    return this.service.timeLength;
  }

  getTimeLength(): number {
    if (TimeRange.isTimeRange(this.timeRange)) {
      return this.timeRange.minutes();
    } else {
      return this.getServieTimeLength();
    }
  }
}
