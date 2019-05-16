import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as moment from 'moment';
import { DateRange } from '../date-range';

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
  emitChange: (value: DateRange) => {};
  emitTouched: () => {};

  onChange(value: DateRangeMoment) {
    this.dateRange = value;
    let outValue = null;
    if (value && value.start && value.end) {
      outValue = new DateRange().fromJSON([
        this.dateRange.start.toISOString(),
        this.dateRange.end.toISOString(),
      ]);
    }
    this.emitChange(outValue);
  }

  constructor() {}

  writeValue(value: DateRange) {
    console.log(value);
    if (DateRange.isDateRange(value)) {
      this.dateRange = {start: moment(value.start), end: moment(value.end)};
      console.log(this.dateRange);
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
