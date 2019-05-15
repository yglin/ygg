import { isArray, defaults } from "lodash";
// import { NUMBER_FORMAT_REGEXP } from "@angular/common/src/i18n/format_number";

export class NumberRange {
  _min: number;
  _max: number;

  static isNumberRange(value: any): value is NumberRange {
    if (value && value.min >= 0 && value.max >= 0 && value.min <= value.max) {
      return true;
    } else {
      return false;
    }
  }

  constructor(data?: any) {
    if (isArray(data) && data.length >= 2) {
      this.min = data[0];
      this.max = data[1];
    }

    defaults(this, {
      min: 0,
      max: Number.MAX_SAFE_INTEGER
    });
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

  toJSON(): Array<Number> {
    return [ this._min, this._max ];
  }
}
