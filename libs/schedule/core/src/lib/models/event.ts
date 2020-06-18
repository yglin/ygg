import { Service } from './service';
import { Entity, generateID } from '@ygg/shared/infra/core';
import { TimeRange } from '@ygg/shared/omni-types/core';
import * as moment from 'moment';

export class ServiceEvent implements Entity {
  id: string;
  service: Service;
  timeRange: TimeRange;
  numParticipants: number;

  constructor(service: Service, options: {
    numParticipants?: number
  } = {}) {
    this.id = generateID();
    this.service = service;
    this.numParticipants = options.numParticipants || 0;
  }

  setTimeRange(start: Date, end?: Date) {
    if (!end) {
      end = moment(start).add(this.service.timeLength, 'minutes').toDate();
    }
    this.timeRange = new TimeRange(start, end);
  }
}
