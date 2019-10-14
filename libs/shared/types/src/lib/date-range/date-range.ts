import { SerializableJSON } from '@ygg/shared/infra/data-access';
import { isArray, random } from 'lodash';
import * as moment from 'moment';

export interface DateRangeMoment {
  start: moment.Moment;
  end: moment.Moment;
}

export class DateRange implements SerializableJSON {
  // Refer to https://momentjs.com/docs/#/displaying/format/
  // for format signature options
  static format = 'l';
  private _start: Date;
  private _end: Date;

  static isDateRange(value: any): value is DateRange {
    return (
      value &&
      value.start &&
      value.start instanceof Date &&
      value.end &&
      value.end instanceof Date
    );
  }

  static forge(): DateRange {
    const start = moment().add(random(6), 'month');
    const end = moment(start).add(random(30), 'day');
    return new DateRange().fromMoment({ start, end });
  }

  get start(): Date {
    return this._start;
  }

  get end(): Date {
    return this._end;
  }

  constructor() {
    this._start = new Date();
    this._end = new Date();
  }

  fromJSON(data: any): this {
    try {
      let start: Date;
      let end: Date;
      if (DateRange.isDateRange(data)) {
        start = data.start;
        end = data.end;
      } else if (isArray(data) && data.length >= 2) {
        start = moment(data[0], DateRange.format).toDate();
        end = moment(data[1], DateRange.format).toDate();
      } else {
        const forged = DateRange.forge();
        start = forged.start;
        end = forged.end;
      }
      if (start > end) {
        this._start = end;
        this._end = start;
      } else {
        this._start = start;
        this._end = end;
      }
    } catch (error) {
      console.error(error);
    }
    return this;
  }

  toJSON(): any {
    return [
      moment(this.start).format(DateRange.format),
      moment(this.end).format(DateRange.format)
    ];
  }

  fromMoment(dateRangeMoment: DateRangeMoment): this {
    return this.fromJSON([
      dateRangeMoment.start.toDate(),
      dateRangeMoment.end.toDate()
    ]);
  }

  toMoment(): DateRangeMoment {
    return { start: moment(this.start), end: moment(this.end) };
  }

  format(): string {
    return `${moment(this.start).format('YYYY/MM/DD')} — ${moment(
      this.end
    ).format('YYYY/MM/DD')}`;
  }
}
