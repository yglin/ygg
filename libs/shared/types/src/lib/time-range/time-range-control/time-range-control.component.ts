import { Component, forwardRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { noop } from 'lodash';
import { TimeRange } from '../time-range';

@Component({
  selector: 'ygg-time-range-control',
  templateUrl: './time-range-control.component.html',
  styleUrls: ['./time-range-control.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimeRangeControlComponent),
    multi: true
  }]
})
export class TimeRangeControlComponent implements ControlValueAccessor {
  formGroup: FormGroup;
  emitChange: (value: TimeRange) => any = noop;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      start: [new Date(), Validators.required],
      end: [new Date(), Validators.required]
    });

    this.formGroup.valueChanges.subscribe(value => {
      const timeRange = new TimeRange(value.start, value.end);
      this.emitChange(timeRange);
    });
  }

  writeValue(value: TimeRange) {
    if (value && TimeRange.isTimeRange(value)) {
      this.formGroup.get('start').setValue(value.start);
      this.formGroup.get('end').setValue(value.end);
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}

}

