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
      numParticipants?: number;
    } = {}
  ) {
    this.id = generateID();
    this.name = service.name;
    this.image = service.image;
    this.service = service;
    this.numParticipants = options.numParticipants || 0;
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
