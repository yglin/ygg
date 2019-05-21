import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as moment from 'moment';
import { DateRange } from '../date-range';
import { MatDialog } from '@angular/material';
import { DateRangePickerDialogComponent, DateRangePickerDialogData } from './date-range-picker-dialog/date-range-picker-dialog.component';

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
  _dateRange: DateRange;
  emitChange: (value: DateRange) => {};
  emitTouched: () => {};

  constructor(
    private dialog: MatDialog
  ) {}

  get dateRange(): DateRange {
    return this._dateRange;
  }

  set dateRange(value: DateRange) {
    if (DateRange.isDateRange(value)) {
      this._dateRange = value;
      this.emitChange(this._dateRange);
    }
  }

  writeValue(value: DateRange) {
    // console.log(value);
    if (DateRange.isDateRange(value)) {
      this._dateRange = value;
      // console.log(this.dateRange);
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched(fn) {
    this.emitTouched = fn;
  }

  openPicker() {
    const dialogData: DateRangePickerDialogData = {
      dateRange: this.dateRange
    };
    const dialogRef = this.dialog.open(DateRangePickerDialogComponent, {
      data: dialogData
    });
    const subscription = dialogRef.afterClosed().subscribe(dateRange => {
      this.dateRange = dateRange;
      subscription.unsubscribe();
    });
  }

  onBlur() {
    if (this.emitTouched) {
      this.emitTouched();
    }
  }
}
