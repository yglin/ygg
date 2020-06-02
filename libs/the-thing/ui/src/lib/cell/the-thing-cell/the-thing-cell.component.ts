import { Component, OnInit, Input, forwardRef, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl
} from '@angular/forms';
import { TheThingCell } from '@ygg/the-thing/core';
import { noop } from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'the-thing-cell',
  templateUrl: './the-thing-cell.component.html',
  styleUrls: ['./the-thing-cell.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TheThingCellComponent),
      multi: true
    }
  ]
})
export class TheThingCellComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() readonly: boolean;
  @Input() required: boolean;
  @Input() cell: TheThingCell;
  onChange: (cell: TheThingCell) => any = noop;
  onTouched: () => any = noop;
  formControl: FormControl = new FormControl(null);
  subscriptions: Subscription[] = [];

  constructor() {
    this.subscriptions.push(
      this.formControl.valueChanges.subscribe(value => {
        if (!!this.cell) {
          this.cell.value = value;
          this.onChange(this.cell);
        }
      })
    );
  }

  writeValue(cell: TheThingCell): void {
    this.cell = cell;
    if (!!this.cell) {
      this.formControl.setValue(this.cell.value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    this.readonly = this.readonly !== undefined && this.readonly !== false;
    this.required = this.required !== undefined && this.required !== false;
    if (this.cell) {
      this.writeValue(this.cell);
    }
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
