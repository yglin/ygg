import { Component, OnDestroy, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription, noop } from 'rxjs';
import { Location } from '../location'; // !! Correct import path

@Component({
  selector: 'ygg-location-control',
  templateUrl: './location-control.component.html',
  styleUrls: ['./location-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationControlComponent),
      multi: true
    }
  ]
})
export class LocationControlComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() label: string;
  private _location: Location = new Location();
  set location(value: Location) {
    if (value) {
      this._location = value;
      this.emitChange(this._location);
    }
  }
  get location(): Location {
    return this._location;
  }
  emitChange: (value: Location) => any = noop;

  subscriptions: Subscription[] = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: Location) {
    if (Location.isLocation(value)) {
      this._location = value;
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}
}
