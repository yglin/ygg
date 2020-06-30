import { random } from 'lodash';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/data-access';
import { DayTime } from './day-time';
import { TimeRange } from './time-range';

export class DayTimeRange implements SerializableJSON {
  private _start: DayTime;
  get start(): DayTime {
    return this._start;
  }
  private _end: DayTime;
  get end(): DayTime {
    return this._end;
  }

  static forge(): DayTimeRange {
    const start = DayTime.forge();
    const end = DayTime.forge();
    const forged = new DayTimeRange(start, end);
    // console.log('forge DayTimeRange');
    // console.dir(forged);
    return forged;
  }

  static isDayTimeRange(value: any): value is DayTimeRange {
    // console.dir(value.start);
    // console.dir(value.end);
    if (
      !(
        value &&
        DayTime.isDayTime(value.start) &&
        DayTime.isDayTime(value.end) &&
        (value.end.isSame(value.start) || value.end.isAfter(value.start))
      )
    ) {
      console.warn(`Not a valid DayTimeRange: ${value}`);
      return false;
    }
    return true;
  }

  static compare(tr1: DayTimeRange, tr2: DayTimeRange, isAsc: boolean): number {
    if (
      !(DayTimeRange.isDayTimeRange(tr1) && DayTimeRange.isDayTimeRange(tr2))
    ) {
      return 0;
    }
    return (tr1.start.isAfter(tr2.start) ? 1 : -1) * (isAsc ? 1 : -1);
  }

  constructor(start?: DayTime, end?: DayTime) {
    this._start = DayTime.isDayTime(start) ? start : new DayTime(0, 0);
    this._end = DayTime.isDayTime(end) ? end : new DayTime(23, 59);
    this.justifyOrder();
  }

  justifyOrder() {
    if (this._start.isAfter(this._end)) {
      const tmp = this._start;
      this._start = this._end;
      this._end = tmp;
    }
  }

  getLength(): number {
    return (
      (this.end.hour - this.start.hour) * 60 +
      (this.end.minute - this.start.minute)
    );
  }

  isAfter(that: DayTimeRange): boolean {
    if (this.start.isSame(that.start)) {
      return this.end.isAfter(that.end);
    } else {
      return this.start.isAfter(that.start);
    }
  }

  clone(): DayTimeRange {
    return new DayTimeRange(this.start.clone(), this.end.clone());
  }

  merge(that: DayTimeRange, options: any = {}): DayTimeRange {
    const thisMomentRange = moment.range(
      this.start.toMoment(),
      this.end.toMoment()
    );
    const thatMomentRange = moment.range(
      that.start.toMoment(),
      that.end.toMoment()
    );
    const merged = thisMomentRange.add(thatMomentRange, options);
    if (merged) {
      return new DayTimeRange(
        new DayTime().fromMoment(merged.start),
        new DayTime().fromMoment(merged.end)
      );
    } else {
      return null;
    }
  }

  subtract(that: DayTimeRange): DayTimeRange[] {
    const thisMomentRange = moment.range(
      this.start.toMoment(),
      this.end.toMoment()
    );
    const thatMomentRange = moment.range(
      that.start.toMoment(),
      that.end.toMoment()
    );
    const subtracted = thisMomentRange.subtract(thatMomentRange);
    return subtracted
      .filter(momentRange => !!momentRange)
      .map(
        momentRange =>
          new DayTimeRange(
            new DayTime().fromMoment(momentRange.start),
            new DayTime().fromMoment(momentRange.end)
          )
      );
  }

  include(
    value: DayTime | TimeRange,
    options: {
      inclusiveEnd?: boolean;
    } = {}
  ): boolean {
    if (DayTime.isDayTime(value)) {
      return (
        (value.isSame(this.start) || value.isAfter(this.start)) &&
        (value.isBefore(this.end) ||
          (options.inclusiveEnd ? value.isSame(this.end) : false))
      );
    } else if (TimeRange.isTimeRange(value)) {
      return (
        this.include(DayTime.fromDate(value.start)) &&
        this.include(DayTime.fromDate(value.end), { inclusiveEnd: true })
      );
    } else {
      return false;
    }
  }

  alignHalfHour(): DayTimeRange {
    const start = new DayTime(
      this.start.hour,
      this.start.minute >= 30 ? 30 : 0
    );
    const end = new DayTime(
      this.end.hour + (this.end.minute > 30 ? 1 : 0),
      this.end.minute > 30 ? 0 : 30
    );
    return new DayTimeRange(start, end);
  }

  format(startTokenString: string = 'HH:mm', endTokenString?: string): string {
    endTokenString = endTokenString || startTokenString;
    const formattedStart = this.start.format(startTokenString);
    const formattedEnd = this.end.format(endTokenString);
    return `${formattedStart} - ${formattedEnd}`;
  }

  fromJSON(data: any): this {
    if (data && data.start && data.end) {
      this._start = new DayTime().fromJSON(data.start);
      this._end = new DayTime().fromJSON(data.end);
      this.justifyOrder();
    }
    return this;
  }

  toJSON(): any {
    return {
      start: this.start.toJSON(),
      end: this.end.toJSON()
    };
  }
}
