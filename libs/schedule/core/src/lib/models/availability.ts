import { TimeRange, BusinessHours } from '@ygg/shared/omni-types/core';
import { Service } from './service';
import { extend } from 'lodash';
import { ServiceEvent } from './event';
import * as moment from 'moment';

export class ServiceAvailablility {
  // Referenced service id
  serviceId: string;

  // subject time range
  timeRange: TimeRange;

  // time length of each reduced availability in minutes
  intervalLength: number;

  // Array of available quantity in each intervalUnit
  availability: number[] = [];

  constructor(
    serviceId: string,
    options: {
      timeRange: TimeRange;
      capacity: number;
      intervalUnit?: number;
    }
  ) {
    this.serviceId = serviceId;
    this.intervalLength = 30;
    extend(this, options);
    this.timeRange.forEachInterval(
      this.intervalLength,
      (interval: TimeRange) => {
        this.availability.push(options.capacity);
      }
    );
  }

  mergeBusinessHours(businessHours: BusinessHours) {
    this.timeRange.forEachInterval(
      this.intervalLength,
      (interval: TimeRange) => {
        const index = this.getIndex(interval.start);
        if (!businessHours.include(interval)) {
          this.availability[index] = 0;
        }
      }
    );
  }

  getIndex(time: Date): number {
    return Math.floor(
      moment(time).diff(this.timeRange.start, 'minute') / this.intervalLength
    );
  }

  addOccupancy(timeRange: TimeRange, quantity: number) {
    const startIndex =
      timeRange.start > this.timeRange.start
        ? this.getIndex(timeRange.start)
        : 0;
    const endIndex =
      timeRange.end < this.timeRange.end
        ? this.getIndex(timeRange.end)
        : this.availability.length;
    for (let index = startIndex; index < endIndex; index++) {
      this.availability[index] = Math.max(
        0,
        this.availability[index] - quantity
      );
    }
  }

  forEachInterval(
    handler: (
      interval: TimeRange,
      availability: number,
      index?: number,
      range?: TimeRange
    ) => void
  ) {
    this.timeRange.forEachInterval(
      this.intervalLength,
      (interval, index, range) => {
        handler(interval, this.availability[index], index, range);
      }
    );
  }

  getSubAvailability(timeRange: TimeRange): ServiceAvailablility {
    const sub = new ServiceAvailablility(this.serviceId, {
      timeRange: timeRange,
      intervalUnit: this.intervalLength,
      capacity: 0
    });
    const startIndex =
      timeRange.start > this.timeRange.start
        ? Math.floor(
            moment(timeRange.start).diff(this.timeRange.start, 'minute') /
              this.intervalLength
          )
        : 0;
    const endIndex =
      timeRange.end < this.timeRange.end
        ? startIndex + Math.ceil(timeRange.minutes() / this.intervalLength)
        : this.availability.length;
    sub.availability = this.availability.slice(startIndex, endIndex);
    return sub;
  }

  getSingleAvailability(timeRange: TimeRange): number {
    if (timeRange.minutes() <= this.intervalLength) {
      const index = this.getIndex(timeRange.start);
      return this.availability[index];
    } else {
      const subAvail: ServiceAvailablility = this.getSubAvailability(timeRange);
      return subAvail.availability[0];
    }
  }

  print(): string {
    let result = '';
    const timeIterator = moment(this.timeRange.start);
    const date = moment(this.timeRange.start).startOf('day');
    result += `\n ==== ${date.format('M/D')} ==== \n`;
    while (timeIterator.isBefore(this.timeRange.end)) {
      if (!timeIterator.isSame(date, 'day')) {
        date.add(1, 'day');
        result += `\n ==== ${date.format('M/D')} ==== \n`;
      }
      const aval = this.availability[this.getIndex(timeIterator.toDate())];
      result += `${timeIterator.format('hh:mm')}[${aval}]\t`;
      timeIterator.add(this.intervalLength, 'minute');
    }
    return result;
  }
}
