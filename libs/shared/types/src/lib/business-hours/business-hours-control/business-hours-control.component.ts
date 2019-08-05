import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { BusinessHours } from '../business-hours';
import { OpenHour } from '../open-hour';
import { WeekDayOptions } from '../week-day';
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { noop, range } from 'lodash';
import { TimeRange } from '../../time-range';

@Component({
  selector: 'ygg-business-hours-control',
  templateUrl: './business-hours-control.component.html',
  styleUrls: ['./business-hours-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BusinessHoursControlComponent),
      multi: true
    }
  ]
})
export class BusinessHoursControlComponent implements ControlValueAccessor {
  @Input() label: string;

  private _businessHours: BusinessHours = new BusinessHours();
  set businessHours(value: BusinessHours) {
    if (value && BusinessHours.isBusinessHours(value)) {
      this._businessHours = value;
      this.emitChange(this._businessHours);
    }
  }
  get businessHours(): BusinessHours {
    return this._businessHours;
  }
  emitChange: (value: BusinessHours) => any = noop;

  formGroupOpenHour: FormGroup;

  weekDayOptions = WeekDayOptions;

  constructor(private formBuilder: FormBuilder) {
    this.formGroupOpenHour = this.formBuilder.group({
      weekDay: 7,
      timeRange: new TimeRange()
    });
  }

  writeValue(value: BusinessHours) {
    if (BusinessHours.isBusinessHours(value)) {
      this._businessHours = value;
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}

  clearAll() {
    this._businessHours.clear();
    this.emitChange(this._businessHours);
  }

  addOpenHour() {
    const weekDay = this.formGroupOpenHour.get('weekDay').value;
    const timeRange = this.formGroupOpenHour.get('timeRange').value;
    if (weekDay === 7) {
      for (const day of range(7)) {
        const openHour = new OpenHour(day, timeRange);
        this._businessHours.addOpenHour(openHour);
      }
    } else {
      const openHour = new OpenHour(weekDay, timeRange);
      this._businessHours.addOpenHour(openHour);
    }
    this.emitChange(this._businessHours);
  }

  deleteOpenHour(index: number) {
    this._businessHours.removeOpenHourByIndex(index);
    this.emitChange(this._businessHours);
  }

  subtractOpenHour() {
    const weekDay = this.formGroupOpenHour.get('weekDay').value;
    const timeRange = this.formGroupOpenHour.get('timeRange').value;
    const openHour = new OpenHour(weekDay, timeRange);
    this._businessHours.subtractOpenHour(openHour);
  }
}
