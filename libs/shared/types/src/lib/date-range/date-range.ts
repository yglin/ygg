import {SerializableJSON} from '@ygg/shared/infra/data-access';
import {isArray} from 'lodash';
import * as moment from 'moment';

export interface DateRangeMoment {
  start: moment.Moment, end: moment.Moment
}

export class DateRange implements SerializableJSON {
  private _start: Date;
  private _end: Date;

  static isDateRange(value: any): value is DateRange {
    return (
        value && value.start && value.start instanceof Date && value.end &&
        value.end instanceof Date);
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
    let start: Date;
    let end: Date;
    if (isArray(data) && data.length >= 2) {
      start = new Date(data[0]);
      end = new Date(data[1]);
    } else if (DateRange.isDateRange(data)) {
      start = data.start;
      end = data.end;
    } else {
      start = moment().add(1, 'month').toDate();
      end = moment().add(1, 'month').add(1, 'week').toDate();
    }
    if (start > end) {
      this._start = end;
      this._end = start;
    } else {
      this._start = start;
      this._end = end;
    }
    return this;
  }

  toJSON(): any {
    return [this._start.toISOString(), this._end.toISOString()]
  }

  fromMoment(dateRangeMoment: DateRangeMoment): this {
    return this.fromJSON([
      dateRangeMoment.start.toDate(),
      dateRangeMoment.end.toDate(),
    ]);
  }

  toMoment(): DateRangeMoment {
    return {
      start: moment(this.start),
      end: moment(this.end)
    };
  }
}