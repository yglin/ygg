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

  constructor(...args: any[]) {
    let hour: number;
    let minute: number;
    if (args.length >= 1) {
      if (DayTime.isDayTime(args[0])) {
        hour = args[0].hour;
        minute = args[0].minute;
      } else if (typeof args[0] === 'string') {
        const mnt = moment(args[0], 'HH:mm');
        hour = mnt.hour();
        minute = mnt.minute();
      } else if (moment.isMoment(args[0])) {
        const mnt = args[0];
        hour = mnt.hour();
        minute = mnt.minute();
      } else if (args.length >= 2) {
        hour = args[0];
        minute = args[1];
      }
    } else {
      hour = 0;
      minute = 0;
    }
    this._hour = clamp(hour, 0, 23);
    this._minute = clamp(minute, 0, 59);
  }

  isSame(that: DayTime): boolean {
    return this.hour * 60 + this.minute - (that.hour * 60 + that.minute) === 0;
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
