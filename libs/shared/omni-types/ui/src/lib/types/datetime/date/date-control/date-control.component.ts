import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl
} from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DATE_FORMATS } from '@ygg/shared/omni-types/core';
import { noop } from 'lodash';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'ygg-date-control',
  templateUrl: './date-control.component.html',
  styleUrls: ['./date-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateControlComponent),
      multi: true
    },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      useValue: DATE_FORMATS
    }
  ]
})
export class DateControlComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  formControl = new FormControl(null);
  emitChange: (value: Date) => any = noop;
  emitTouched: () => any = noop;
  subscriptions: Subscription[] = [];

  constructor(
    private dateAdapter: DateAdapter<any> // @Inject(LOCALE_ID) public locale_id: string
  ) {
    // Set locale
    //@ts-ignore
    const locale_id = navigator.language || navigator.userLanguage;
    this.dateAdapter.setLocale(locale_id);

    this.subscriptions.push(
      this.formControl.valueChanges.subscribe(value => {
        if (moment.isMoment(value)) {
          this.emitChange(value.toDate());
        }
      })
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: Date): void {
    if (value instanceof Date) {
      this.formControl.setValue(moment(value).startOf('day'), {
        emitEvent: false
      });
    }
  }

  registerOnChange(fn: any): void {
    this.emitChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.emitTouched = fn;
  }

  ngOnInit(): void {}
}
