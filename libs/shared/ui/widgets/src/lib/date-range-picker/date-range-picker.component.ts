import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as moment from 'moment';

interface DateRangeDate {
  start: Date, end: Date
}

interface DateRangeMoment {
  start: moment.Moment, end: moment.Moment
}

@Component({
  selector: 'ygg-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    }
  ]
})
export class DateRangePickerComponent implements ControlValueAccessor {
  dateRange: DateRangeMoment;
  emitChange: (value: DateRangeDate) => {};
  emitTouched: () => {};

  onChange(value: DateRangeMoment) {
    this.dateRange = value;
    let outValue = null;
    if (value && value.start && value.end) {
      outValue = {
        start: this.dateRange.start.toDate(),
        end: this.dateRange.end.toDate(),
      };
    }
    this.emitChange(outValue);
  }

  constructor() {}

  writeValue(value: DateRangeDate) {
    if (value && value.start && value.end) {
      this.dateRange = {start: moment(value.start), end: moment(value.end)};
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched(fn) {
    this.emitTouched = fn;
  }

  onBlur() {
    if (this.emitTouched) {
      this.emitTouched();
    }
  }
}
