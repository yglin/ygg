import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ICON_REGISTRY_PROVIDER } from '@angular/material';

@Component({
  selector: 'ygg-number-slider',
  templateUrl: './number-slider.component.html',
  styleUrls: ['./number-slider.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberSliderComponent),
      multi: true
    }
  ]
})
export class NumberSliderComponent implements OnInit, ControlValueAccessor {
  @Input() label = '';
  @Input() icon;
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() zeroIsNoLimit: boolean;
  iconType: string;

  _value = 0;
  emitChange: (value: number) => any;

  set value(_value: number) {
    if (_value !== this._value) {
      this._value = _value;
      if (this.emitChange) {
        this.emitChange(this._value);
      }
    }
  }

  get value(): number {
    return this._value;
  }

  constructor() {
    this.zeroIsNoLimit = this.zeroIsNoLimit === undefined ? false : true;
  }

  ngOnInit() {
    if (this.icon) {
      try {
        const url = new URL(this.icon);
        this.iconType = 'url';
      } catch (error) {
        this.iconType = 'font';
      }
    }
  }

  writeValue(value: number) {
    // alert(`Initial value of number-slider-control: ${value}`);
    if (value !== this._value) {
      this._value = value;
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched(fn) {}
}
