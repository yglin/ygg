import { isArray, random } from "lodash";
import { SerializableJSON } from '@ygg/shared/infra/data-access';
// import { NUMBER_FORMAT_REGEXP } from "@angular/common/src/i18n/format_number";

export class NumberRange implements SerializableJSON {
  _min: number;
  _max: number;

  static forge(): NumberRange {
    const forged = new NumberRange();
    forged.min = random(1, 100);
    forged.max = random(1, 100);
    return forged;
  }

  static isNumberRange(value: any): value is NumberRange {
    if (value && value.min >= 0 && value.max >= 0 && value.min <= value.max) {
      return true;
    } else {
      return false;
    }
  }

  constructor(...args: number[]) {
    this._min = 0;
    this._max = 0;
    if (args) {
      if (args.length === 1) {
        this._max = args[0];
      } else if (args.length >= 2) {
        this._min = args[0];
        this._max = args[1];
      }
    }
  }

  set min(_min: number) {
    this._min = _min;
    if (this._max < this._min) {
      this._max = this._min;
    }
  }

  get min(): number {
    return this._min;
  }

  set max(_max: number) {
    this._max = _max;
    if (this._min > this._max) {
      this._min = this._max;
    }
  }

  get max(): number {
    return this._max;
  }

  fromJSON(data: any): this {
    if (isArray(data) && data.length >= 2) {
      this.min = data[0];
      this.max = data[1];
    }
    return this;
  }

  toJSON(): Array<Number> {
    return [ this._min, this._max ];
  }
}
