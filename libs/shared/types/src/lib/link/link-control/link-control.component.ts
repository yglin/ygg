import { noop } from 'lodash';
import validator from 'validator';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  Validator,
  ValidationErrors,
  AbstractControl,
  FormControl,
  Validators
} from '@angular/forms';
import { Component, Input, OnInit, forwardRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

function urlValidator(control: AbstractControl): ValidationErrors {
  if (control.value && !validator.isURL(control.value)) {
    return {
      url: true
    };
  } else {
    return null;
  }
}

@Component({
  selector: 'ygg-link-control',
  templateUrl: './link-control.component.html',
  styleUrls: ['./link-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LinkControlComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LinkControlComponent),
      multi: true
    }
  ]
})
export class LinkControlComponent
  implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  @Input() required: boolean;
  @Input() label: string;
  formControl: FormControl;
  onChange: (value: string) => any = noop;
  onTouched: () => any = noop;
  linkPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  subscriptions: Subscription[] = [];

  constructor() {}

  // notifyValueChange(): void {
  //   this.onChange(this.formControl.value);
  // }

  ngOnInit(): void {
    this.label = this.label || '請填入網址';
    this.required = this.required !== undefined && this.required !== false;
    const validators = [urlValidator];
    if (this.required) {
      validators.push(Validators.required);
    }
    this.formControl = new FormControl('', validators);
    this.subscriptions.push(this.formControl.valueChanges.subscribe(value => {
      this.onChange(value);
    }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: string): void {
    this.formControl.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  onFocus() {
    this.onTouched();
  }

  validate(control: AbstractControl): ValidationErrors {
    // console.log(this.formControl.errors);
    return this.formControl.errors;
  }
}
