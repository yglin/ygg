import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { noop, isEmpty } from 'lodash';
import { DayTimeRange, DayTime } from '@ygg/shared/omni-types/core';
import { Subscription } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { DayTimeRangeViewPageObject } from '../day-time-range-view/day-time-range-view.component.po';
import { SlideInOutAnimation } from '@ygg/shared/ui/themes';

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
  ],
  animations: [SlideInOutAnimation]
})
export class DayTimeRangeControlComponent
  implements ControlValueAccessor, OnDestroy {
  @Input() label: string;
  errorMessages: string[] = [];
  stateShowError = 'out';
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
      start: [null, Validators.required],
      end: [null, Validators.required]
    });

    this.subscriptions.push(
      this.formGroup.valueChanges
        .pipe(
          tap(() => {
            this.errorMessages = [];
          }),
          tap(value => {
            // console.log('DayTimeRangeControlComponent value change !!');
            // console.dir(value);
            if (!(value && value.start && value.end)) {
              this.errorMessages.push(`請輸入開始時間和結束時間`);
            } else if (value.start.isAfter(value.end)) {
              this.errorMessages.push(`結束時間必須在開始時間之前`);
            }
            this.stateShowError = isEmpty(this.errorMessages) ? 'out' : 'in';
          }),
          filter(value => value && DayTimeRange.isDayTimeRange(value)),
          tap(value =>
            this.emitChange(new DayTimeRange(value.start, value.end))
          )
        )
        .subscribe()
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
