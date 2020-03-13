import { noop } from 'lodash';
import { Component, forwardRef, OnDestroy, Inject, Input } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl
} from '@angular/forms';
import * as moment from 'moment';
import { DateRange, DATE_FORMATS } from '@ygg/shared/omni-types/core';
import { Subscription, merge } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  DateAdapter,
  MAT_DATE_FORMATS
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

@Component({
  selector: 'ygg-date-range-control',
  templateUrl: './date-range-control.component.html',
  styleUrls: ['./date-range-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangeControlComponent),
      multi: true
    },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      useValue: DATE_FORMATS
    }
  ]
})
export class DateRangeControlComponent
  implements ControlValueAccessor, OnDestroy {
  @Input() label = '';
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
          map(() => [this.startFormControl.value, this.endFormControl.value]),
          filter(([startValue, endValue]) => {
            return (
              startValue &&
              startValue.isValid() &&
              endValue &&
              endValue.isValid()
              && startValue.isSameOrBefore(endValue)
            );
          })
        )
        // this.startFormControl.valueChanges
        .subscribe(([startValue, endValue]) => {
          const dateRange = new DateRange(startValue.toDate(), endValue.toDate());
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
    // console.log(value);
    // console.log(DateRange.isDateRange(value));
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
  //   const dialogData: DateRangeControlDialogData = {
  //     dateRange: this.dateRange
  //   };
  //   const dialogRef = this.yggDialog.open(DateRangeControlDialogComponent, {
  //     title: '請選擇日期',
  //     data: dialogData
  //   });
  //   const subscription = dialogRef.afterClosed().subscribe(dateRange => {
  //     this.dateRange = dateRange;
  //     subscription.unsubscribe();
  //   });
  // }

  // formalize() {
  //   const startValue: moment.Moment = this.startFormControl.value;
  //   const endValue: moment.Moment = this.endFormControl.value;
  //   if (startValue && endValue && startValue.isAfter(endValue)) {
  //     this.startFormControl.setValue(endValue, {
  //       emitEvent: false
  //     });
  //     this.endFormControl.setValue(startValue, {
  //       emitEvent: false
  //     });
  //     const dateRange = new DateRange().fromMoment({
  //       start: endValue,
  //       end: startValue
  //     });
  //     this.emitChange(dateRange);
  //   }
  // }

  // onChange(dateRange: DateRange) {
  //   if (DateRange.isDateRange(dateRange)) {
  //     this.emitChange(dateRange);
  //   }
  // }

  onBlur() {
    if (this.emitTouched) {
      this.emitTouched();
    }
    // Don't automatically fix date order for user in this stage
    // this.formalize();
  }
}
