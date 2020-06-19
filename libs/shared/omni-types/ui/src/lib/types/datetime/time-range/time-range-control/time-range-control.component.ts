import { noop, isEmpty } from 'lodash';
import { Component, forwardRef, OnDestroy, Inject, Input } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl
} from '@angular/forms';
import * as moment from 'moment';
import { TimeRange, DATE_FORMATS, DayTime } from '@ygg/shared/omni-types/core';
import { Subscription, merge } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { SlideInOutAnimation } from '@ygg/shared/ui/themes';

@Component({
  selector: 'ygg-time-range-control',
  templateUrl: './time-range-control.component.html',
  styleUrls: ['./time-range-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeRangeControlComponent),
      multi: true
    },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      useValue: DATE_FORMATS
    }
  ],
  animations: [SlideInOutAnimation]
})
export class TimeRangeControlComponent
  implements ControlValueAccessor, OnDestroy {
  @Input() label = '';
  emitChange: (value: TimeRange) => any = noop;
  emitTouched: () => any = noop;
  startFormControl: FormControl;
  startDayTimeControl: FormControl;
  endFormControl: FormControl;
  endDayTimeControl: FormControl;
  subscriptions: Subscription[] = [];
  errorMessages: string[] = [];
  stateShowError = 'out';

  constructor(
    private dateAdapter: DateAdapter<any> // @Inject(LOCALE_ID) public locale_id: string
  ) {
    // Set locale
    //@ts-ignore
    const locale_id = navigator.language || navigator.userLanguage;
    // console.log(locale_id);
    this.dateAdapter.setLocale(locale_id);

    // Initialize some value
    // const initialValue = TimeRange.forge();
    this.startFormControl = new FormControl(null);
    this.startDayTimeControl = new FormControl(null);
    this.endFormControl = new FormControl(null);
    this.endDayTimeControl = new FormControl(null);

    this.subscriptions.push(
      merge(
        this.startFormControl.valueChanges,
        this.startDayTimeControl.valueChanges,
        this.endFormControl.valueChanges,
        this.endDayTimeControl.valueChanges
      )
        .pipe(
          tap(() => (this.errorMessages = [])),
          filter(() => {
            const start: moment.Moment = this.startFormControl.value;
            const end: moment.Moment = this.endFormControl.value;
            if (
              !(
                start &&
                start.isValid() &&
                end &&
                end.isValid()
              )
            ) {
              this.errorMessages.push(`請填入開始日期與結束日期`);
              return false;
            } else {
              return true;
            }
          }),
          filter(() => {
            const startTime: DayTime = this.startDayTimeControl.value;
            const endTime: DayTime = this.endDayTimeControl.value;
            if (
              !(DayTime.isDayTime(startTime) && DayTime.isDayTime(endTime))
            ) {
              this.errorMessages.push(`請填入開始時間與結束時間`);
              return false;
            } else {
              return true;
            }            
          }),
          map(() => {
            const start: moment.Moment = this.startFormControl.value;
            const end: moment.Moment = this.endFormControl.value;
            const startTime: DayTime = this.startDayTimeControl.value;
            const endTime: DayTime = this.endDayTimeControl.value;
            start.hour(startTime.hour).minute(startTime.minute);
            end.hour(endTime.hour).minute(endTime.minute);
            return [start, end];
          }),
          filter(([startValue, endValue]) => {
            if (startValue.isAfter(endValue)) {
              this.errorMessages.push(`開始時間必須在結束時間之前`);
              return false;
            } else {
              return true;
            }
          })
        )
        // this.startFormControl.valueChanges
        .subscribe(([startValue, endValue]) => {
          this.stateShowError = isEmpty(this.errorMessages) ? 'out' : 'in';
          const timeRange = new TimeRange(
            startValue.toDate(),
            endValue.toDate()
          );
          this.emitChange(timeRange);
          // console.log(`Emit Change: ${TimeRange.format()}`);
        })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: TimeRange) {
    // console.log(value);
    // console.log(TimeRange.isTimeRange(value));
    if (TimeRange.isTimeRange(value)) {
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
  //   const dialogData: TimeRangeControlDialogData = {
  //     TimeRange: this.TimeRange
  //   };
  //   const dialogRef = this.yggDialog.open(TimeRangeControlDialogComponent, {
  //     title: '請選擇日期',
  //     data: dialogData
  //   });
  //   const subscription = dialogRef.afterClosed().subscribe(TimeRange => {
  //     this.TimeRange = TimeRange;
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
  //     const TimeRange = new TimeRange().fromMoment({
  //       start: endValue,
  //       end: startValue
  //     });
  //     this.emitChange(TimeRange);
  //   }
  // }

  // onChange(TimeRange: TimeRange) {
  //   if (TimeRange.isTimeRange(TimeRange)) {
  //     this.emitChange(TimeRange);
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
