import { Component, OnDestroy, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { Subscription, noop } from 'rxjs';
import { GeoPoint } from '@ygg/shared/omni-types/core';

@Component({
  selector: 'ygg-geo-point-control',
  templateUrl: './geo-point-control.component.html',
  styleUrls: ['./geo-point-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GeoPointControlComponent),
      multi: true
    }
  ]
})
export class GeoPointControlComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() label: string;
  private _geoPoint: GeoPoint = new GeoPoint();
  set geoPoint(value: GeoPoint) {
    if (GeoPoint.isGeoPoint(value)) {
      this._geoPoint = new GeoPoint().fromJSON(value);
      this.emitChange(this._geoPoint);
    }
  }
  get geoPoint(): GeoPoint {
    return this._geoPoint;
  }
  emitChange: (value: GeoPoint) => any = noop;
  subscriptions: Subscription[] = [];
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group(this.geoPoint.toJSON());
    this.subscriptions.push(
      this.formGroup.valueChanges.subscribe(value => {
        if (GeoPoint.isGeoPoint(value)) {
          this.geoPoint = GeoPoint.fromLatLng(value.latitude, value.longitude);
        }
      })
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: GeoPoint) {
    if (GeoPoint.isGeoPoint(value)) {
      this._geoPoint = new GeoPoint().fromJSON(value);
      if (this.formGroup) {
        this.formGroup.setValue(this._geoPoint.toJSON(), { emitEvent: false });
      }
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}

  onChangeMapMarker(geoPoint: GeoPoint) {
    this.geoPoint = geoPoint;
    this.formGroup.setValue(this.geoPoint.toJSON());
  }
}
