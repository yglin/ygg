import { random } from 'lodash';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import { SerializableJSON } from '@ygg/shared/infra/data-access';

export class TimeRange implements SerializableJSON {
  private _start: Date;
  get start(): Date {
    return this._start;
  }
  private _end: Date;
  get end(): Date {
    return this._end;
  }

  static forge(): TimeRange {
    const start = moment()
      .hour(random(0, 10))
      .minute(random(0, 59))
      .toDate();
    const end = moment(start)
      .add(random(60 * 10), 'minute')
      .toDate();
    return new TimeRange(start, end);
  }

  static isTimeRange(value: any): value is TimeRange {
    return !!(
      value &&
      value.start &&
      value.start instanceof Date &&
      value.end &&
      value.end instanceof Date
    );
  }

  static compare(tr1: TimeRange, tr2: TimeRange): number {
    return (
      tr1.start.getHours() * 60 +
      tr1.start.getMinutes() -
      (tr2.start.getHours() * 60 + tr2.start.getMinutes())
    );
  }

  constructor(start?: string | Date | TimeRange, end?: string | Date) {
    if (TimeRange.isTimeRange(start)) {
      this._start = new Date(start.start);
      this._end = new Date(start.end);
    } else {
      if (typeof start === 'string') {
        this._start = moment(start, 'HH:mm').toDate();
      } else if (start instanceof Date) {
        this._start = new Date(start);
      } else {
        this._start = new Date();
        this._start.setHours(0);
        this._start.setMinutes(0);
      }
      if (typeof end === 'string') {
        this._end = moment(end, 'HH:mm').toDate();
      } else if (end instanceof Date) {
        this._end = new Date(end);
      } else {
        this._end = new Date();
        this._end.setHours(0);
        this._end.setMinutes(0);
      }
    }
    this.justifyOrder();
  }

  justifyOrder() {
    if (this._start > this._end) {
      const tmp = this._start;
      this._start = this._end;
      this._end = tmp;
    }
  }

  merge(that: TimeRange, options: any = {}): TimeRange {
    const thisMomentRange = moment.range(this.start, this.end);
    const thatMomentRange = moment.range(that.start, that.end);
    const merged = thisMomentRange.add(thatMomentRange, options);
    if (merged) {
      return new TimeRange(merged.start.toDate(), merged.end.toDate());
    } else {
      return null;
    }
  }

  subtract(that: TimeRange): TimeRange[] {
    const thisMomentRange = moment.range(this.start, this.end);
    const thatMomentRange = moment.range(that.start, that.end);
    const subtracted = thisMomentRange.subtract(thatMomentRange);
    return subtracted
      .filter(momentRange => !!momentRange)
      .map(
        momentRange =>
          new TimeRange(momentRange.start.toDate(), momentRange.end.toDate())
      );
  }

  format(startTokenString: string = 'HH:mm', endTokenString?: string): string {
    const formattedStart = moment(this.start).format(startTokenString);
    endTokenString = endTokenString || startTokenString;
    const formattedEnd = moment(this.end).format(endTokenString);
    return `${formattedStart} - ${formattedEnd}`;
  }

  fromJSON(data: any): this {
    if (data && data.start && data.end) {
      this._start = new Date(data.start);
      this._end = new Date(data.end);
      this.justifyOrder();
    }
    return this;
  }

  toJSON(): any {
    return {
      start: this.start.toISOString(),
      end: this.end.toISOString()
    };
  }
}
