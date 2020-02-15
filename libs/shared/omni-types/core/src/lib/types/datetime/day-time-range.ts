import { random } from 'lodash';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/data-access';
import { DayTime } from './day-time';

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
    return new DayTimeRange(start, end);
  }

  static isDayTimeRange(value: any): value is DayTimeRange {
    return !!(
      value &&
      DayTime.isDayTime(value.start) &&
      DayTime.isDayTime(value.end)
    );
  }

  static compare(tr1: DayTimeRange, tr2: DayTimeRange, isAsc: boolean): number {
    if (!(DayTimeRange.isDayTimeRange(tr1) && DayTimeRange.isDayTimeRange(tr2))) {
      return 0;
    }
    return (tr1.start.isAfter(tr2.start) ? 1 : -1) * (isAsc ? 1 : -1);
  }

  constructor(...args: any[]) {
    let start: DayTime = new DayTime();
    let end: DayTime = new DayTime();
    if (args.length >= 1) {
      if (DayTimeRange.isDayTimeRange(args[0])) {
        start = args[0].start;
        end = args[0].end;
      } else if (args.length >= 2) {
        start = new DayTime(args[0]);
        end = new DayTime(args[1]);
      }
    }
    this._start = start;
    this._end = end;
    this.justifyOrder();
  }

  justifyOrder() {
    if (this._start.isAfter(this._end)) {
      const tmp = this._start;
      this._start = this._end;
      this._end = tmp;
    }
  }

  isAfter(that: DayTimeRange): boolean {
    if (this.start.isSame(that.start)) {
      return this.end.isAfter(that.end);
    } else {
      return this.start.isAfter(that.start);
    }
  }

  merge(that: DayTimeRange, options: any = {}): DayTimeRange {
    const thisMomentRange = moment.range(this.start.toMoment(), this.end.toMoment());
    const thatMomentRange = moment.range(that.start.toMoment(), that.end.toMoment());
    const merged = thisMomentRange.add(thatMomentRange, options);
    if (merged) {
      return new DayTimeRange(merged.start, merged.end);
    } else {
      return null;
    }
  }

  subtract(that: DayTimeRange): DayTimeRange[] {
    const thisMomentRange = moment.range(this.start.toMoment(), this.end.toMoment());
    const thatMomentRange = moment.range(that.start.toMoment(), that.end.toMoment());
    const subtracted = thisMomentRange.subtract(thatMomentRange);
    return subtracted
      .filter(momentRange => !!momentRange)
      .map(
        momentRange =>
          new DayTimeRange(momentRange.start, momentRange.end)
      );
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
