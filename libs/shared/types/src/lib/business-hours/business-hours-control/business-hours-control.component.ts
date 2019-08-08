import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { BusinessHours } from '../business-hours';
import { OpenHour } from '../open-hour/open-hour';
import { WeekDayNames } from '../../week-day';
import {
  // FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { noop, range } from 'lodash';
import { DayTimeRange } from '../../day-time-range';

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

  weekDayNames = WeekDayNames;

  constructor(private formBuilder: FormBuilder) {
    this.formGroupOpenHour = this.formBuilder.group({
      weekDay: 7,
      dayTimeRange: new DayTimeRange()
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
    if (confirm('清除所有服務時段？')) {
      this._businessHours.clear();
      this.emitChange(this._businessHours);
    }
  }

  addOpenHour() {
    const weekDay = this.formGroupOpenHour.get('weekDay').value;
    const dayDayTimeRange = this.formGroupOpenHour.get('dayTimeRange').value;
    if (weekDay === 7) {
      for (const day of range(7)) {
        const openHour = new OpenHour(day, dayDayTimeRange);
        this._businessHours.addOpenHour(openHour);
      }
    } else {
      const openHour = new OpenHour(weekDay, dayDayTimeRange);
      this._businessHours.addOpenHour(openHour);
    }
    this.formGroupOpenHour.setValue(new OpenHour());
    // console.log(`dayTimeRange reset to ${this.formGroupOpenHour.get('dayTimeRange').value.toJSON()}`);
    this.emitChange(this._businessHours);
  }

  deleteOpenHour(index: number) {
    this._businessHours.removeOpenHourByIndex(index);
    this.emitChange(this._businessHours);
  }

  subtractOpenHour() {
    const weekDay = this.formGroupOpenHour.get('weekDay').value;
    const dayDayTimeRange = this.formGroupOpenHour.get('dayTimeRange').value;
    const openHour = new OpenHour(weekDay, dayDayTimeRange);
    this._businessHours.subtractOpenHour(openHour);
  }
}
