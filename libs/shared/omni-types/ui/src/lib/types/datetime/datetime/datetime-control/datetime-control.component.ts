import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DATE_FORMATS, DayTime } from '@ygg/shared/omni-types/core';
import * as moment from 'moment';
import { noop } from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-datetime-control',
  templateUrl: './datetime-control.component.html',
  styleUrls: ['./datetime-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimeControlComponent),
      multi: true
    }
  ]
})
export class DatetimeControlComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  formGroup: FormGroup;
  emitChange: (value: Date) => any = noop;
  onTouched: () => any = noop;
  subscriptions: Subscription[] = [];

  constructor(formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      date: [null, Validators.required],
      dayTime: [null, Validators.required]
    });

    this.subscriptions.push(
      this.formGroup.valueChanges.subscribe(formValue => {
        if (
          formValue.date instanceof Date &&
          DayTime.isDayTime(formValue.dayTime)
        ) {
          const date = new Date(formValue.date);
          const dayTime: DayTime = formValue.dayTime;
          date.setHours(dayTime.hour);
          date.setMinutes(dayTime.minute);
          this.emitChange(date);
        }
      })
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: Date): void {
    if (value instanceof Date) {
      this.formGroup.get('date').setValue(value, { emitEvent: false });
      this.formGroup
        .get('dayTime')
        .setValue(DayTime.fromDate(value), { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.emitChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {}
}
