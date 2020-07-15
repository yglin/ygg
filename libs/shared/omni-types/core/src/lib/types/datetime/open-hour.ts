import { random } from 'lodash';
import { SerializableJSON } from '@ygg/shared/infra/core';
import { WeekDay, WeekDayNames } from './week-day';
import { DayTimeRange } from './day-time-range';
import { TimeRange } from './time-range';
import * as moment from 'moment';

export class OpenHour implements SerializableJSON {
  weekDay: WeekDay;
  dayTimeRange: DayTimeRange;

  static forge(): OpenHour {
    const forged = new OpenHour(random(0, 6), DayTimeRange.forge());
    // console.log('Forge OpenHour');
    // console.dir(forged);
    return forged;
  }

  static isOpenHour(value: any): value is OpenHour {
    if (
      !(
        value &&
        value.weekDay >= 0 &&
        value.weekDay < 7 &&
        DayTimeRange.isDayTimeRange(value.dayTimeRange)
      )
    ) {
      console.warn(`Not a valid open-hour: ${value}`);
      return false;
    }
    return true;
  }

  constructor(weekDay?: WeekDay, dayTimeRange?: DayTimeRange) {
    this.weekDay = typeof weekDay === 'number' ? weekDay : 0;
    this.dayTimeRange = DayTimeRange.isDayTimeRange(dayTimeRange)
      ? dayTimeRange
      : new DayTimeRange();
  }

  clone(): OpenHour {
    return new OpenHour(this.weekDay, this.dayTimeRange);
  }

  isAfter(that: OpenHour): boolean {
    if (this.weekDay !== that.weekDay) {
      return this.weekDay > that.weekDay;
    } else {
      return this.dayTimeRange.isAfter(that.dayTimeRange);
    }
  }

  include(timeRange: TimeRange): boolean {
    if (this.weekDay !== moment(timeRange.start).day()) {
      return false;
    }
    return this.dayTimeRange.include(timeRange);
  }

  merge(openHour: OpenHour): OpenHour {
    if (openHour.weekDay !== this.weekDay) {
      return null;
    }
    const mergedDayTimeRange = this.dayTimeRange.merge(openHour.dayTimeRange, {
      adjacent: true
    });
    if (mergedDayTimeRange) {
      return new OpenHour(this.weekDay, mergedDayTimeRange);
    } else {
      return null;
    }
  }

  subtract(that: OpenHour): OpenHour[] {
    if (this.weekDay !== that.weekDay) {
      return [this];
    } else {
      const subtDayTimeRanges: DayTimeRange[] = this.dayTimeRange.subtract(
        that.dayTimeRange
      );
      return subtDayTimeRanges.map(
        dayTimeRange => new OpenHour(this.weekDay, dayTimeRange)
      );
    }
  }

  format(
    dayToken: string = 'ddd',
    startTokens: string = 'HH:mm',
    endTokens?: string
  ) {
    // TODO: dayName may follow rule of dayToken
    const dayName = WeekDayNames[this.weekDay];
    return `${dayName} ${this.dayTimeRange.format(startTokens, endTokens)}`;
  }

  fromJSON(data: any): this {
    if (data) {
      if (data.weekDay) {
        this.weekDay = data.weekDay;
      }
      if (data.dayTimeRange) {
        this.dayTimeRange.fromJSON(data.dayTimeRange);
      }
    }
    return this;
  }

  toJSON(): any {
    return {
      weekDay: this.weekDay,
      dayTimeRange: this.dayTimeRange.toJSON()
    };
  }
}
