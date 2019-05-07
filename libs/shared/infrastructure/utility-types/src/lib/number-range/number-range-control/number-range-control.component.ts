import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NumberRange } from '../number-range';

@Component({
  selector: 'ygg-number-range-control',
  templateUrl: './number-range-control.component.html',
  styleUrls: ['./number-range-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberRangeControlComponent),
      multi: true
    }
  ]
})
export class NumberRangeControlComponent implements ControlValueAccessor {
  numberRange = new NumberRange();
  @Input() globalMin = 0;
  @Input() globalMax = 54088;
  @Input() globalStep = 100;
  emitChange: (numberRange: NumberRange) => any;

  constructor() { }

  set min(_min: number) {
    this.numberRange.min = _min;
    this.emitChange(this.numberRange);
  }

  get min(): number {
    return this.numberRange.min;
  }

  set max(_max: number) {
    this.numberRange.max = _max;
    this.emitChange(this.numberRange);
  }

  get max(): number {
    return this.numberRange.max;
  }

  writeValue(numberRange: NumberRange) {
    if (numberRange) {
      if (numberRange.min !== this.numberRange.min) {
        this.numberRange.min = numberRange.min;
      }
      this.numberRange.min = Math.max(this.numberRange.min, this.globalMin);
      if (numberRange.max !== this.numberRange.max) {
        this.numberRange.max = numberRange.max;
      }
      this.numberRange.max = Math.min(this.numberRange.max, this.globalMax);
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched(fn) { }


}
