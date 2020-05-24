import * as moment from 'moment';
import { noop, clamp } from 'lodash';
import { Component, OnInit, Input, forwardRef, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { DayTime } from '@ygg/shared/omni-types/core';
@Component({
  selector: 'ygg-day-time-control',
  templateUrl: './day-time-control.component.html',
  styleUrls: ['./day-time-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DayTimeControlComponent),
      multi: true
    }
  ]
})
export class DayTimeControlComponent
  implements ControlValueAccessor, OnDestroy {
  @Input() label = '';
  emitChange: (value: DayTime) => any = noop;
  subscriptions: Subscription[] = [];
  formGroup: FormGroup;

  _dayTime: DayTime = null;
  set dayTime(value: DayTime) {
    if (DayTime.isDayTime(value)) {
      this._dayTime = value;
      this.emitChange(this._dayTime);
    }
  }
  get dayTime(): DayTime {
    return this._dayTime;
  }

  constructor(
    private formBuilder: FormBuilder,
    private amazingTimePickerService: AmazingTimePickerService
  ) {
    this.formGroup = this.formBuilder.group({
      hour: null,
      minute: null
    });

    this.subscriptions.push(
      this.formGroup.valueChanges.subscribe(value => {
        if (DayTime.isDayTime(value)) {
          this.dayTime = new DayTime(value.hour, value.minute);
          if (value.hour !== this.dayTime.hour) {
            this.formGroup.get('hour').setValue(this.dayTime.hour);
          }
          if (value.minute !== this.dayTime.minute) {
            this.formGroup.get('minute').setValue(this.dayTime.minute);
          }
        }
      })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: Date) {
    if (DayTime.isDayTime(value)) {
      this._dayTime = value;
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}

  openTimePicker() {
    const amazingTimePicker = this.amazingTimePickerService.open({
      time: !!this.dayTime ? this.dayTime.format('HH:mm') : '12:00'
    });
    amazingTimePicker.afterClose().subscribe(timeToken => {
      if (timeToken) {
        this.dayTime = new DayTime().fromMoment(moment(timeToken, 'HH:mm'));
        this.formGroup.setValue(
          {
            hour: this.dayTime.hour,
            minute: this.dayTime.minute
          },
          { emitEvent: false }
        );
      }
    });
  }
}
