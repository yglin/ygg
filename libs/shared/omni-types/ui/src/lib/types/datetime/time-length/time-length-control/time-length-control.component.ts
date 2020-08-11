import { Component, OnInit, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { TimeLength } from '@ygg/shared/omni-types/core';

@Component({
  selector: 'ygg-time-length-control',
  templateUrl: './time-length-control.component.html',
  styleUrls: ['./time-length-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeLengthControlComponent),
      multi: true
    }
  ]
})
export class TimeLengthControlComponent
  implements OnInit, ControlValueAccessor {
  @Input() required: boolean;

  formControlLength: FormControl = new FormControl(0);
  emitChange: (value: TimeLength) => any;

  timeLength: TimeLength = new TimeLength();
  timeLengthText: string = this.timeLength.format();

  constructor() {}

  ngOnInit() {
    this.required = this.required === undefined ? false : true;
    this.formControlLength.valueChanges.subscribe(length => {
      this.timeLength.length = length;
      this.timeLengthText = this.timeLength.format();
      if (typeof this.emitChange === 'function') {
        this.emitChange(this.timeLength);
      }
    });
  }

  writeValue(value: TimeLength) {
    // alert(`Initial value of number-control-control: ${value}`);
    if (TimeLength.isTimeLength(value)) {
      this.timeLength = value;
      this.timeLengthText = this.timeLength.format();
      this.formControlLength.setValue(this.timeLength.length, {
        emitEvent: false
      });
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched(fn) {}
}
