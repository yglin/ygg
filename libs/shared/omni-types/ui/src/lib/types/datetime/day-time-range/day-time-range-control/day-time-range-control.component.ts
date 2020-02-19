import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { noop } from 'lodash';
import { DayTimeRange, DayTime } from '@ygg/shared/omni-types/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-day-time-range-control',
  templateUrl: './day-time-range-control.component.html',
  styleUrls: ['./day-time-range-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DayTimeRangeControlComponent),
      multi: true
    }
  ]
})
export class DayTimeRangeControlComponent
  implements ControlValueAccessor, OnDestroy {
  @Input() label: string;
  // _dayTimeRange: DayTimeRange = new DayTimeRange(
  //   new DayTime(0, 0),
  //   new DayTime(0, 0)
  // );
  // set dayTimeRange(value: DayTimeRange) {
  //   if (DayTimeRange.isDayTimeRange(value)) {
  //     this._dayTimeRange = value;
  //     this.emitChange(this._dayTimeRange);
  //   }
  // }
  // get dayTimeRange(): DayTimeRange {
  //   return this._dayTimeRange;
  // }

  formGroup: FormGroup;
  emitChange: (value: DayTimeRange) => any = noop;
  subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      start: [new DayTime(0, 0), Validators.required],
      end: [new DayTime(0, 0), Validators.required]
    });

    this.subscriptions.push(
      this.formGroup.valueChanges.subscribe((value: DayTimeRange) => {
        if (
          !!value &&
          DayTime.isDayTime(value.start) &&
          DayTime.isDayTime(value.end) &&
          value.end.isAfter(value.start)
        ) {
          this.emitChange(new DayTimeRange(value));
        }
      })
    );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: DayTimeRange) {
    if (DayTimeRange.isDayTimeRange(value)) {
      this.formGroup.get('start').setValue(value.start, { onlySelf: true });
      this.formGroup.get('end').setValue(value.end, { onlySelf: true });
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}
}
