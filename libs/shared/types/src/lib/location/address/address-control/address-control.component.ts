import { Component, OnDestroy, Input, forwardRef } from '@angular/core';
import { Address } from '../address';
import { noop } from 'lodash';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-address-control',
  templateUrl: './address-control.component.html',
  styleUrls: ['./address-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressControlComponent),
      multi: true
    }
  ]
})
export class AddressControlComponent
  implements OnDestroy, ControlValueAccessor {
  @Input() label: string;
  private _address: Address = new Address();
  set address(value: Address) {
    if (Address.isAddress(value)) {
      this._address = new Address().fromJSON(value);
      this.emitChange(this._address);
    }
  }
  get address(): Address {
    return this._address;
  }
  emitChange: (value: Address) => any = noop;
  subscriptions: Subscription[] = [];

  rawInputControl: FormControl = new FormControl('');

  constructor() {
    this.subscriptions.push(
      this.rawInputControl.valueChanges.pipe().subscribe(value => {
        this.address = Address.fromRaw(value);
      })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: Address) {
    if (Address.isAddress(value)) {
      this._address = new Address().fromJSON(value);
      this.rawInputControl.setValue(this._address.getFullAddress(), { emitEvent: false });
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}
}
