import { noop } from "lodash";
import { Component, forwardRef, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl
} from '@angular/forms';
import * as moment from 'moment';
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
  emitChange: (value: DateRange) => any = noop;
  emitTouched: () => any = noop;
  startFormControl: FormControl = new FormControl(null);
  endFormControl: FormControl = new FormControl(null);
  subscriptions: Subscription[] = [];

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
          const dateRange = new DateRange().fromMoment({
            start: startValue,
            end: endValue
          });
          this.emitChange(dateRange);
          console.log(`Emit Change: ${dateRange.format()}`);
        })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: DateRange) {
    if (DateRange.isDateRange(value)) {
      this.startFormControl.setValue(value.start.toISOString(), {
        emitEvent: false
      });
      this.endFormControl.setValue(value.end.toISOString(), {
        emitEvent: false
      });      
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

  formalize() {
    const startValue: moment.Moment = this.startFormControl.value;
    const endValue: moment.Moment = this.endFormControl.value;
    if (startValue.isAfter(endValue)) {
      this.startFormControl.setValue(endValue, {
        emitEvent: false
      });
      this.endFormControl.setValue(startValue, {
        emitEvent: false
      });
      const dateRange = new DateRange().fromMoment({
        start: endValue,
        end: startValue
      });
      this.emitChange(dateRange);
    }
  }

  onBlur() {
    if (this.emitTouched) {
      this.emitTouched();
    }
    this.formalize();
  }
}
