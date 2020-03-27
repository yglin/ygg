import { random } from 'lodash';
import { SerializableJSON } from '@ygg/shared/infra/data-access';
import { WeekDay, WeekDayNames } from './week-day';
import { DayTimeRange } from './day-time-range';

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
    return !!(
      value &&
      value.weekDay >= 0 &&
      value.weekDay < 7 &&
      DayTimeRange.isDayTimeRange(value.dayTimeRange)
    );
  }

  constructor(...args: any[]) {
    if (args.length >= 1 && OpenHour.isOpenHour(args[0])) {
      this.weekDay = args[0].weekDay;
      this.dayTimeRange = new DayTimeRange(args[0].dayTimeRange);
    } else if (args.length >= 2 && typeof args[0] === 'number') {
      this.weekDay = args[0];
      if (args.length === 2 && DayTimeRange.isDayTimeRange(args[1])) {
        // console.dir(args[1]);
        this.dayTimeRange = new DayTimeRange(args[1]);
        // console.dir(this.dayTimeRange);
      } else if (args.length >= 3) {
        this.dayTimeRange = new DayTimeRange(args[1], args[2]);
      }
    } else {
      this.weekDay = 0;
      this.dayTimeRange = new DayTimeRange();
    }
  }

  isAfter(that: OpenHour): boolean {
    if (this.weekDay !== that.weekDay) {
      return this.weekDay > that.weekDay;
    } else {
      return this.dayTimeRange.isAfter(that.dayTimeRange);
    }
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
