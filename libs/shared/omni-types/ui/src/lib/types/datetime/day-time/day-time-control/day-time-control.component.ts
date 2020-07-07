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
import { tap, filter } from 'rxjs/operators';
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
  dayTime: DayTime;

  // _dayTime: DayTime = null;
  // set dayTime(value: DayTime) {
  //   if (DayTime.isDayTime(value)) {
  //     this._dayTime = value;
  //     this.emitChange(this._dayTime);
  //   }
  // }
  // get dayTime(): DayTime {
  //   return this._dayTime;
  // }

  constructor(
    private formBuilder: FormBuilder,
    private amazingTimePickerService: AmazingTimePickerService
  ) {
    this.formGroup = this.formBuilder.group({
      hour: null,
      minute: null
    });

    this.subscriptions.push(
      this.formGroup.valueChanges
        .pipe(
          tap(value => {
            let hour = value.hour;
            if (typeof value.hour === 'string') {
              hour = parseInt(value.hour);
            }
            let minute = value.minute;
            if (typeof value.minute === 'string') {
              minute = parseInt(value.minute);
            }
            // console.log(hour);
            // console.log(minute);
            if (typeof hour === 'number' && typeof minute === 'number') {
              this.dayTime = new DayTime(hour, minute);
            } else {
              this.dayTime = null;
            }
            if (DayTime.isDayTime(this.dayTime)) {
              this.emitChange(this.dayTime);
            }
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: DayTime) {
    console.log(value);
    if (DayTime.isDayTime(value)) {
      this.formGroup.get('hour').setValue(value.hour, { emitEvent: false });
      this.formGroup.get('minute').setValue(value.minute, { emitEvent: false });
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}

  openTimePicker() {
    const amazingTimePicker = this.amazingTimePickerService.open({
      time: !!this.dayTime ? this.dayTime.format('HH:mm') : '10:00'
    });
    amazingTimePicker.afterClose().subscribe(timeToken => {
      if (timeToken) {
        try {
          const tokens = timeToken.split(':');
          const hour = parseInt(tokens[0]);
          const minute = parseInt(tokens[1]);
          this.formGroup.setValue({
            hour,
            minute
          });
        } catch (error) {
          console.warn(`Failed to parse time token: ${timeToken} `);
        }
      }
    });
  }
}
