import { noop } from 'lodash';
import { Component, forwardRef, OnDestroy, Inject } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl
} from '@angular/forms';
import * as moment from 'moment';
import { DateRange, DATE_FORMATS } from '../date-range';
// import { YggDialogService } from '@ygg/shared/ui/widgets';
// import {
//   DateRangePickerDialogComponent,
//   DateRangePickerDialogData
// } from './date-range-picker-dialog/date-range-picker-dialog.component';
import { Subscription, merge, combineLatest } from 'rxjs';
import { auditTime, filter, distinctUntilChanged } from 'rxjs/operators';
import {
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
// import { LOCALE_ID } from '@angular/core';

@Component({
  selector: 'ygg-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      useValue: DATE_FORMATS
    }
  ]
})
export class DateRangePickerComponent
  implements ControlValueAccessor, OnDestroy {
  emitChange: (value: DateRange) => any = noop;
  emitTouched: () => any = noop;
  startFormControl: FormControl;
  endFormControl: FormControl;
  subscriptions: Subscription[] = [];

  constructor(
    private dateAdapter: DateAdapter<any>,
    // @Inject(LOCALE_ID) public locale_id: string
  ) {
    // Set locale
    //@ts-ignore
    const locale_id = navigator.language || navigator.userLanguage;
    // console.log(locale_id);
    this.dateAdapter.setLocale(locale_id);

    // Initialize some value
    // const initialValue = DateRange.forge();
    this.startFormControl = new FormControl(null);
    this.endFormControl = new FormControl(null);

    this.subscriptions.push(
      merge(
        this.startFormControl.valueChanges,
        this.endFormControl.valueChanges
      )
        .pipe(
          // auditTime(500)
          filter(() => {
            const startValue: moment.Moment = this.startFormControl.value;
            const endValue: moment.Moment = this.endFormControl.value;
            return (
              startValue &&
              startValue.isValid() &&
              endValue &&
              endValue.isValid()
            );
          })
        )
        // this.startFormControl.valueChanges
        .subscribe(() => {
          const startValue: moment.Moment = this.startFormControl.value;
          const endValue: moment.Moment = this.endFormControl.value;
          const dateRange = new DateRange().fromMoment({
            start: startValue,
            end: endValue
          });
          this.emitChange(dateRange);
          // console.log(`Emit Change: ${dateRange.format()}`);
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
      this.startFormControl.setValue(moment(value.start), {
        emitEvent: false
      });
      this.endFormControl.setValue(moment(value.end), {
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
    if (startValue && endValue && startValue.isAfter(endValue)) {
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
    // Don't automatically fix date order for user in this stage
    // this.formalize();
  }
}
