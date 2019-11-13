import { SerializableJSON } from '@ygg/shared/infra/data-access';
import { isArray, random } from 'lodash';
import * as moment from 'moment';

export interface TimeRangeMoment {
  start: moment.Moment;
  end: moment.Moment;
}

// Formats refers to https://momentjs.com/docs/#/displaying/format/
export const DATE_FORMATS = {
  parse: {
    dateInput: ['l', 'L']
  },
  display: {
    date: 'L',
    dateInput: 'L',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
  serialize: moment.defaultFormat
};

export class TimeRange implements SerializableJSON {
  protected _start: Date;
  get start(): Date {
    return this._start;
  }
  set start(value: Date) {
    this._start = value;
  }
  protected _end: Date;
  get end(): Date {
    return this._end;
  }
  set end(value: Date) {
    this._end = value;
  }

  static isTimeRange(value: any): value is TimeRange {
    return (
      value &&
      value._start &&
      value._start instanceof Date &&
      value._end &&
      value._end instanceof Date
    );
  }

  static forge(): TimeRange {
    const start = moment().add(random(6), 'month');
    const end = moment(start).add(random(7), 'day');
    return new TimeRange(start.toDate(), end.toDate());
  }

  constructor(...args: Date[]) {
    if (args.length >= 2) {
      this.start = new Date(args[0]);
      this.end = new Date(args[1]);
      this.normalize();
    } else {
      this.start = new Date();
      this.end = new Date();
    }
  }

  clone(): TimeRange {
    return new TimeRange(new Date(this.start), new Date(this.end));
  }

  normalize() {
    if (this.start > this.end) {
      // swap start and end
      const tmpDate = new Date(this.start);
      this.start = this.end;
      this.end = tmpDate;
    }
  }

  fromJSON(data: string[]): this {
    this.start = moment(data[0], DATE_FORMATS.serialize).toDate();
    this.end = moment(data[1], DATE_FORMATS.serialize).toDate();
    this.normalize();
    return this;
  }

  toJSON(): string[] {
    return [
      moment(this.start).format(DATE_FORMATS.serialize),
      moment(this.end).format(DATE_FORMATS.serialize)
    ];
  }

  fromMoment(dateRangeMoment: TimeRangeMoment): this {
    this.start = dateRangeMoment.start.toDate();
    this.end = dateRangeMoment.end.toDate();
    this.normalize();
    return this;
  }

  toMoment(): TimeRangeMoment {
    return { start: moment(this.start), end: moment(this.end) };
  }

  format(tokenString: string = DATE_FORMATS.display.date): string {
    return `${moment(this.start).format(tokenString)} — ${moment(
      this.end
    ).format(tokenString)}`;
  }
}
