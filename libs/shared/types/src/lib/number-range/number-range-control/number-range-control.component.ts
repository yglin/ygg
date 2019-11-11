import { Component, Input, forwardRef, OnInit, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl
} from '@angular/forms';
import { NumberRange } from '../number-range';
import { noop } from 'lodash';
import { Subscription, merge, combineLatest } from 'rxjs';
import { debounceTime, tap, map, filter } from 'rxjs/operators';

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
  inputMinControl: FormControl;
  sliderMinControl: FormControl;
  inputMaxControl: FormControl;
  sliderMaxControl: FormControl;
  subscriptions: Subscription[] = [];

  constructor() {
    this.inputMinControl = new FormControl();
    this.sliderMinControl = new FormControl();
    this.inputMaxControl = new FormControl();
    this.sliderMaxControl = new FormControl();

    const inputMinValueChange$ = this.inputMinControl.valueChanges.pipe(
      debounceTime(100),
      map((value: string) => parseInt(value)),
      filter(value => typeof(value) === 'number'),
      tap((value: number) => this.sliderMinControl.setValue(value, { emitEvent: false }))
    );
    const sliderMinValueChange$ = this.sliderMinControl.valueChanges.pipe(
      tap(value => this.inputMinControl.setValue(value, { emitEvent: false }))
    );
    const inputMaxValueChange$ = this.inputMaxControl.valueChanges.pipe(
      debounceTime(100),
      map((value: string) => parseInt(value)),
      filter(value => typeof(value) === 'number'),
      tap(value => this.sliderMaxControl.setValue(value, { emitEvent: false }))
    );
    const sliderMaxValueChange$ = this.sliderMaxControl.valueChanges.pipe(
      tap(value => this.inputMaxControl.setValue(value, { emitEvent: false }))
    );

    const minChange$ = merge(inputMinValueChange$, sliderMinValueChange$);

    const maxChange$ = merge(inputMaxValueChange$, sliderMaxValueChange$);

    this.subscriptions.push(combineLatest([minChange$, maxChange$])
      .subscribe(([min, max]) => {
        if ((min > 0 || max > 0) && min <= max) {
          const numberRange = new NumberRange(min, max);
          this.emitChange(numberRange);
        }
      }));
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
