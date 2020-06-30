import * as moment from 'moment';
import { clamp, random } from 'lodash';
import { SerializableJSON } from '@ygg/shared/infra/data-access';

/**
 * Represent an absolute time in a day
 */
export class DayTime implements SerializableJSON {
  static DISPLAY_FORMAT = 'A h:mm';

  private _hour: number;
  get hour(): number {
    return this._hour;
  }
  private _minute: number;
  get minute(): number {
    return this._minute;
  }

  static fromDate(date: Date): DayTime {
    return new DayTime(date.getHours(), date.getMinutes());
  }

  static isDayTime(value: any): value is DayTime {
    if (
      !(
        value &&
        typeof value._hour === 'number' &&
        typeof value._minute === 'number'
      )
    ) {
      console.warn(`Not a valid DayTime: ${value}`);
      return false;
    }
    return true;
  }

  static forge(): DayTime {
    // console.log('forge DayTime');
    return new DayTime(random(0, 23), random(0, 59));
  }

  constructor(hour?: number, minute?: number) {
    // let hour: number;
    // let minute: number;
    // if (args.length >= 1) {
    //   if (DayTime.isDayTime(args[0])) {
    //     hour = args[0].hour;
    //     minute = args[0].minute;
    //   } else if (typeof args[0] === 'string') {
    //     const mnt = moment(args[0], 'HH:mm');
    //     hour = mnt.hour();
    //     minute = mnt.minute();
    //   } else if (moment.isMoment(args[0])) {
    //     const mnt = args[0];
    //     hour = mnt.hour();
    //     minute = mnt.minute();
    //   } else if (args.length >= 2) {
    //     hour = args[0];
    //     minute = args[1];
    //   }
    // } else {
    //   hour = 0;
    //   minute = 0;
    // }
    this._hour = typeof hour === 'number' ? clamp(hour, 0, 23) : 0;
    this._minute = typeof minute === 'number' ? clamp(minute, 0, 59) : 0;
    // console.log('DayTime constructor');
    // console.log(args);
    // console.log(this._hour);
    // console.log(this._minute);
  }

  isSame(that: DayTime): boolean {
    return this.hour * 60 + this.minute - (that.hour * 60 + that.minute) === 0;
  }

  isAfter(that: DayTime): boolean {
    return this.hour * 60 + this.minute - (that.hour * 60 + that.minute) > 0;
  }

  isBefore(that: DayTime): boolean {
    return this.hour * 60 + this.minute - (that.hour * 60 + that.minute) < 0;
  }

  clone(): DayTime {
    return new DayTime(this.hour, this.minute);
  }

  format(tokensString: string = 'HH:mm'): string {
    return this.toMoment().format(tokensString);
  }

  add(amount: number, unit: 'minute'): this {
    const resultMinutes = this.hour * 60 + this.minute + amount;
    this._hour = resultMinutes / 60;
    this._minute = resultMinutes % 60;
    return this;
  }

  isAlreadyNextDay(): boolean {
    return this.hour >= 24;
  }

  fromMoment(mmt: moment.Moment): DayTime {
    this._hour = mmt.hour();
    this._minute = mmt.minute();
    return this;
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
