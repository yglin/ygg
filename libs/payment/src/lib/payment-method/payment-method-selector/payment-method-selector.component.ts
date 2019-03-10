import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PaymentMethod } from '@ygg/interfaces';
import { PaymentService } from '../../payment.service';
// import { PaymentService } from '../payment.service';

@Component({
  selector: 'ygg-payment-method-selector',
  templateUrl: './payment-method-selector.component.html',
  styleUrls: ['./payment-method-selector.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PaymentMethodSelectorComponent),
      multi: true
    }
  ]
})
export class PaymentMethodSelectorComponent
  implements OnInit, ControlValueAccessor {
  _selected: string;
  emitChange: (value: string) => {};
  paymentMethods: PaymentMethod[];

  set selected(value: string) {
    this._selected = value;
    this.emitChange(this._selected);
  }

  get selected(): string {
    return this._selected;
  }

  constructor(protected paymentService: PaymentService) {}

  ngOnInit() {
    this.paymentService.getPaymentMethods().subscribe(paymentMethods => {
      this.paymentMethods = paymentMethods;
    });
  }

  writeValue(value: any) {
    if (value) {
      this._selected = value;
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched(fn) {}
}
