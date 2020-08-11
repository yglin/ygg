import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/core';
import { extend, random } from 'lodash';

export type TimeLengthUnit = 'minute';

export class TimeLength implements SerializableJSON {
  length: number = 0;
  unit: TimeLengthUnit = 'minute';

  static isTimeLength(value: any): value is TimeLength {
    return !!(value && typeof value.length === 'number' && value.unit);
  }

  static forge(options: any = {}): TimeLength {
    return new TimeLength(random(180));
  }

  static compare(tl1: TimeLength, tl2: TimeLength, isAsc: boolean): number {
    return (tl1.valueOf() - tl2.valueOf()) * (isAsc ? 1 : -1);
  }

  constructor(length?: number, unit?: TimeLengthUnit) {
    this.length = length || 0;
    this.unit = unit || 'minute';
  }

  // Return time length in milliseconds
  valueOf(): number {
    switch (this.unit) {
      case 'minute':
        return this.length * 60 * 1000;

      default:
        throw new Error(
          `TimeLength.valueOf(): Unsupported unit "${this.unit}"`
        );
    }
  }

  getLength(): number {
    return this.length;
  }

  format(): string {
    switch (this.unit) {
      case 'minute':
        const hours = Math.floor(this.length / 60);
        const minutes = this.length % 60;
        return `${hours > 0 ? hours + '小時' : ''}${minutes}分鐘`;

      default:
        throw new Error(
          `TimeLength.valueOf(): Unsupported unit "${this.unit}"`
        );
    }
  }

  fromJSON(data: any): this {
    extend(this, data);
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
