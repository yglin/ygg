import { random } from 'lodash';
import * as moment from 'moment';
import { TimeRange } from './time-range';

export class DateRange extends TimeRange {
  static compare(a: DateRange, b: DateRange, isAsc: boolean): number {
    return TimeRange.compare(a, b, isAsc);
  }

  static isDateRange(value: any): value is DateRange {
    return !!(
      value &&
      value._start &&
      value._start instanceof Date &&
      value._end &&
      value._end instanceof Date
    );
  }

  static forge(): DateRange {
    const start = moment().add(random(6), 'month');
    const end = moment(start).add(random(7), 'day');
    return new DateRange(start.toDate(), end.toDate());
  }

  get start(): Date {
    return this._start;
  }
  set start(value: Date) {
    this._start = moment(value)
      .startOf('day')
      .toDate();
  }
  get end(): Date {
    return this._end;
  }
  set end(value: Date) {
    this._end = moment(value)
      .startOf('day')
      .toDate();
  }

  toTimeRange(): TimeRange {
    return new TimeRange(
      moment(this.start)
        .startOf('day')
        .toDate(),
      moment(this.end)
        .endOf('day')
        .toDate()
    );
  }
}
