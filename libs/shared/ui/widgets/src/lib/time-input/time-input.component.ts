import * as moment from 'moment';
import { noop, clamp } from 'lodash';
import { Component, OnInit, Input, forwardRef, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AmazingTimePickerService } from 'amazing-time-picker';

@Component({
  selector: 'ygg-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeInputComponent),
      multi: true
    }
  ]
})
export class TimeInputComponent implements ControlValueAccessor, OnDestroy {
  @Input() label = '';
  inputHourControl: FormControl = new FormControl(0);
  inputMinuteControl: FormControl = new FormControl(0);
  emitChange: (value: Date) => any = noop;
  subscriptions: Subscription[] = [];

  _time: Date = new Date();
  set time(value: Date) {
    if (value) {
      this._time = value;
      this.emitChange(this._time);
    }
  }
  get time(): Date {
    return this._time;
  }

  constructor(
    private amazingTimePickerService: AmazingTimePickerService
  ) {
    this.subscriptions.push(
      this.inputHourControl.valueChanges.subscribe(hour => {
        const justifiedValue = clamp(hour, 0, 23);
        if (justifiedValue !== hour) {
          this.inputHourControl.setValue(justifiedValue, { emitEvent: false });
        }
        this.setHour(justifiedValue);
      })
    );
    this.subscriptions.push(
      this.inputMinuteControl.valueChanges.subscribe(minute => {
        const justifiedValue = clamp(minute, 0, 59);
        if (justifiedValue !== minute) {
          this.inputMinuteControl.setValue(justifiedValue, {
            emitEvent: false
          });
        }
        this.setMinute(justifiedValue);
      })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: Date) {
    if (value) {
      this._time = value;
      this.inputHourControl.setValue(this.time.getHours());
      this.inputMinuteControl.setValue(this.time.getMinutes());
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}

  setHour(hour: number) {
    this._time.setHours(hour);
    this.emitChange(this._time);
  }

  setMinute(minute: number) {
    this._time.setMinutes(minute);
    this.emitChange(this._time);
  }

  openTimePicker() {
    const amazingTimePicker = this.amazingTimePickerService.open({
      time: moment(this.time).format('HH:mm')
    });
    amazingTimePicker.afterClose().subscribe(timeToken => {
      if (timeToken) {
        this.time = moment(timeToken, 'HH:mm').toDate();
        this.inputHourControl.setValue(this.time.getHours());
        this.inputMinuteControl.setValue(this.time.getMinutes());
      }
    });
  }
}
