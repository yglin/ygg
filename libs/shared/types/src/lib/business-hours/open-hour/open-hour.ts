import { random } from 'lodash';
import { TimeRange } from '../../time-range';
import { WeekDay } from '@angular/common';
import { SerializableJSON } from '@ygg/shared/infra/data-access';
import { WeekDayNames } from '../../week-day';

export class OpenHour implements SerializableJSON {
  weekDay: WeekDay;
  timeRange: TimeRange;

  static forge(): OpenHour {
    return new OpenHour(random(0, 6), TimeRange.forge());
  }

  static isOpenHour(value: any): value is OpenHour {
    return !!(
      value &&
      value.weekDay >= 0 &&
      value.weekDay < 7 &&
      TimeRange.isTimeRange(value.timeRange)
    );
  }

  constructor(day?: WeekDay, ...args: any[]) {
    this.weekDay = 0;
    if (typeof day !== 'undefined' && day >= 0) {
      this.weekDay = day;
    }
    if (args.length === 1 && TimeRange.isTimeRange(args[0])) {
      this.timeRange = new TimeRange(args[0]);
    } else if (args.length === 2) {
      this.timeRange = new TimeRange(args[0], args[1]);
    } else {
      this.timeRange = new TimeRange();
    }
  }

  merge(openHour: OpenHour): OpenHour {
    if (openHour.weekDay !== this.weekDay) {
      return null;
    }
    const mergedTimeRange = this.timeRange.merge(openHour.timeRange, { adjacent: true });
    if (mergedTimeRange) {
      return new OpenHour(this.weekDay, mergedTimeRange);
    } else {
      return null;
    }
  }

  subtract(that: OpenHour): OpenHour[] {
    if (this.weekDay !== that.weekDay) {
      return [this];
    } else {
      const subtTimeRanges: TimeRange[] = this.timeRange.subtract(that.timeRange);
      return subtTimeRanges.map(timeRange => new OpenHour(this.weekDay, timeRange));
    }
  }

  format(dayToken: string = 'ddd', startTokens: string = 'HH:mm', endTokens?: string) {
    // TODO: dayName may follow rule of dayToken
    const dayName = WeekDayNames[this.weekDay];
    return `${dayName} ${this.timeRange.format(startTokens, endTokens)}`;
  }

  fromJSON(data: any): this {
    if (data) {
      if (data.weekDay) {
        this.weekDay = data.weekDay;
      }
      if (data.timeRange) {
        this.timeRange = new TimeRange().fromJSON(data.timeRange);
      }
    }
    return this;
  }

  toJSON(): any {
    return {
      weekDay: this.weekDay,
      timeRange: this.timeRange.toJSON()
    };
  }
}
