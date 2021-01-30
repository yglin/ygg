import {
  Component,
  OnInit,
  forwardRef,
  Input,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { noop } from 'lodash';
import { isObservable, Observable, Subscription } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-text-control',
  templateUrl: './text-control.component.html',
  styleUrls: ['./text-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextControlComponent),
      multi: true
    }
  ]
})
export class TextControlComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('tooltipHintInit', { static: false }) tooltipHintInit: MatTooltip;
  @Input() eventBus: Observable<any>;
  @Input() placeholder = 'Please input here...';
  subscription: Subscription = new Subscription();

  onChange: (value) => any = noop;
  onTouched: () => any = noop;

  private _value: any;

  set value(value: any) {
    this._value = value;
    this.notifyValueChange();
  }

  get value(): any {
    return this._value;
  }

  constructor() {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  notifyValueChange(): void {
    if (this.onChange) {
      this.onChange(this.value);
    }
    // if (this.tooltipHintInit) {
    //   this.tooltipHintInit.hide();
    // }
  }

  ngOnInit(): void {
    if (isObservable(this.eventBus)) {
      this.subscription.add(
        this.eventBus.subscribe((event: any) => {
          try {
            switch (event.name) {
              case 'hint':
                this.showHint(event.data);
                break;

              default:
                break;
            }
          } catch (error) {
            console.error(error.message);
          }
        })
      );
    }
  }

  writeValue(obj: any): void {
    this._value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  showHint(hint) {
    try {
      switch (hint.type) {
        case 'init':
          if (this.tooltipHintInit) {
            this.tooltipHintInit.message = hint.message;
            this.tooltipHintInit.show(1000);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(error.message);
    }
  }
}
