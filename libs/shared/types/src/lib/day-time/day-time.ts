import * as moment from 'moment';
import { clamp, random } from 'lodash';
import { SerializableJSON } from '@ygg/shared/infra/data-access';

/**
 * Represent an absolute time in a day
 */
export class DayTime implements SerializableJSON {
  private _hour: number;
  get hour(): number {
    return this._hour;
  }
  private _minute: number;
  get minute(): number {
    return this._minute;
  }

  static isDayTime(value: any): value is DayTime {
    return !!(
      value &&
      typeof value.hour === 'number' &&
      typeof value.minute === 'number'
    );
  }

  static forge(): DayTime {
    return new DayTime(random(0, 23), random(0, 59));
  }

  constructor(arg1: string | number | DayTime | moment.Moment, arg2?: number) {
    let hour: number;
    let minute: number;
    if (moment.isMoment(arg1)) {
      hour = arg1.hour();
      minute = arg1.minute();
    } else if (DayTime.isDayTime(arg1)) {
      hour = arg1.hour;
      minute = arg1.minute;
    } else if (typeof arg1 === 'string') {
      const mt = moment(arg1, 'HH:mm');
      hour = mt.hour();
      minute = mt.minute();
    } else {
      hour = arg1;
      minute = arg2;
    }
    this._hour = clamp(hour, 0, 23);
    this._minute = clamp(minute, 0, 59);
  }

  isAfter(that: DayTime): boolean {
    return this.hour * 60 + this.minute - (that.hour * 60 + that.minute) > 0;
  }

  format(tokensString: string = 'HH:mm'): string {
    return this.toMoment().format(tokensString);
  }

  toMoment(): moment.Moment {
    return moment(0).set({ hour: this.hour, minute: this.minute });
  }

  fromJSON(data: string): this {
    const mt = moment(data, 'HH:mm');
    const hour = mt.hour();
    const minute = mt.minute();
    this._hour = clamp(hour, 0, 23);
    this._minute = clamp(minute, 0, 59);
    return this;
  }

  toJSON(): string {
    return this.format();
  }
}
