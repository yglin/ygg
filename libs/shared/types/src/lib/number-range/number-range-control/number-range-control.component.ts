import { Component, Input, forwardRef, OnInit, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl
} from '@angular/forms';
import { NumberRange } from '../number-range';
import { noop } from 'lodash';
import { Subscription, merge } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'ygg-number-range-control',
  templateUrl: './number-range-control.component.html',
  styleUrls: ['./number-range-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberRangeControlComponent),
      multi: true
    }
  ]
})
export class NumberRangeControlComponent
  implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() globalMin = 0;
  @Input() globalMax = 54088;
  @Input() globalStep = 100;
  @Input() icon;
  @Input() layout;
  emitChange: (numberRange: NumberRange) => any = noop;
  min = 0;
  max = 0;
  inputMinControl: FormControl;
  sliderMinControl: FormControl;
  inputMaxControl: FormControl;
  sliderMaxControl: FormControl;
  subscriptions: Subscription[] = [];

  constructor() {
    this.inputMinControl = new FormControl(this.min);
    this.sliderMinControl = new FormControl(this.min);
    this.inputMaxControl = new FormControl(this.max);
    this.sliderMaxControl = new FormControl(this.max);

    const inputMinValueChange$ = this.inputMinControl.valueChanges.pipe(
      debounceTime(500),
      tap(value => this.sliderMinControl.setValue(value, { emitEvent: false }))
    );
    const sliderMinValueChange$ = this.sliderMinControl.valueChanges.pipe(
      tap(value => this.inputMinControl.setValue(value, { emitEvent: false }))
    );
    const inputMaxValueChange$ = this.inputMaxControl.valueChanges.pipe(
      debounceTime(500),
      tap(value => this.sliderMaxControl.setValue(value, { emitEvent: false }))
    );
    const sliderMaxValueChange$ = this.sliderMaxControl.valueChanges.pipe(
      tap(value => this.inputMaxControl.setValue(value, { emitEvent: false }))
    );

    const minChange$ = merge(inputMinValueChange$, sliderMinValueChange$).pipe(
      tap(min => {
        this.min = min;
        if (this.inputMaxControl.value && this.inputMaxControl.value < min) {
          this.inputMaxControl.setValue(min);
        }
      })
    )

    const maxChange$ = merge(inputMaxValueChange$, sliderMaxValueChange$).pipe(
      tap(max => {
        this.max = max;
        if (this.inputMinControl.value && this.inputMinControl.value > max) {
          this.inputMinControl.setValue(max);
        }
      })
    )

    merge(
      minChange$,
      maxChange$
    )
      .pipe(debounceTime(300))
      .subscribe(() => {
        const numberRange = new NumberRange();
        numberRange.min = this.min;
        numberRange.max = this.max;
        this.emitChange(numberRange);
      });
  }

  writeValue(value: NumberRange) {
    if (NumberRange.isNumberRange(value)) {
      this.inputMinControl.setValue(value.min, { emitEvent: false });
      this.sliderMinControl.setValue(value.min, { emitEvent: false });
      this.inputMaxControl.setValue(value.max, { emitEvent: false });
      this.sliderMaxControl.setValue(value.max, { emitEvent: false });
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched(fn) {}

  ngOnInit() {
    if (!this.layout) {
      this.layout = window.innerWidth > 420 ? 'row' : 'column';
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
