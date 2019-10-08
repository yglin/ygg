import { Component, forwardRef, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl
} from '@angular/forms';
// import * as moment from 'moment';
import { DateRange } from '../date-range';
// import { YggDialogService } from '@ygg/shared/ui/widgets';
// import {
//   DateRangePickerDialogComponent,
//   DateRangePickerDialogData
// } from './date-range-picker-dialog/date-range-picker-dialog.component';
import { Subscription, merge, combineLatest } from 'rxjs';
import { auditTime, filter, distinctUntilChanged } from 'rxjs/operators';

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
export class DateRangePickerComponent
  implements ControlValueAccessor, OnDestroy {
  _dateRange: DateRange;
  emitChange: (value: DateRange) => {};
  emitTouched: () => {};
  startFormControl: FormControl = new FormControl(null);
  endFormControl: FormControl = new FormControl(null);
  subscriptions: Subscription[] = [];

  get dateRange(): DateRange {
    return this._dateRange;
  }

  set dateRange(value: DateRange) {
    if (DateRange.isDateRange(value)) {
      this._dateRange = value;
      this.emitChange(this._dateRange);
    }
  }

  constructor() {
    this.subscriptions.push(
      combineLatest([
        this.startFormControl.valueChanges,
        this.endFormControl.valueChanges
      ])
        .pipe(
          auditTime(500),
          filter(([startValue, endValue]) => startValue && endValue)
        )
        .subscribe(([startValue, endValue]) => {
          // console.log(startValue);
          // console.log(endValue);
          // Check end date must after start date
          if (endValue.isBefore(startValue)) {
            this.startFormControl.setValue(endValue, {
              onlySelf: true
            });
            this.endFormControl.setValue(startValue, {
              onlySelf: true
            });
          }
          this.dateRange = new DateRange().fromMoment({
            start: startValue,
            end: endValue
          });
        })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
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

  // openPicker() {
  //   const dialogData: DateRangePickerDialogData = {
  //     dateRange: this.dateRange
  //   };
  //   const dialogRef = this.yggDialog.open(DateRangePickerDialogComponent, {
  //     title: '請選擇日期',
  //     data: dialogData
  //   });
  //   const subscription = dialogRef.afterClosed().subscribe(dateRange => {
  //     this.dateRange = dateRange;
  //     subscription.unsubscribe();
  //   });
  // }

  onBlur() {
    if (this.emitTouched) {
      this.emitTouched();
    }
  }
}
