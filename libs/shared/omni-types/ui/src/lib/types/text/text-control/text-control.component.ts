import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ygg-text-control',
  templateUrl: './text-control.component.html',
  styleUrls: ['./text-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextControlComponent),
      multi: true
    }
  ]
})
export class TextControlComponent implements OnInit {

  private _value: any;

  set value(value: any) {
    this._value = value;
    this.notifyValueChange();
  }

  get value(): any {
    return this._value;
  }

  onChange: (value) => {};
  onTouched: () => {};

  constructor() { }

  notifyValueChange(): void {
    if (this.onChange) {
      this.onChange(this.value);
    }
  }

  ngOnInit(): void {
    
  }

  writeValue(obj: any): void {
    this._value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }
}

