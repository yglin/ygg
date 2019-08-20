/// <reference types="@types/googlemaps" />
import { Component, OnDestroy, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { Subscription, noop } from 'rxjs';
import { GeoPoint } from '../geo-point';
import { MouseEvent } from '@agm/core';
// import { maps as GoogleMapsApi } from '@types/googlemaps';

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
      this._geoPoint = value;
      this.emitChange(this._geoPoint);
    }
  }
  get geoPoint(): GeoPoint {
    return this._geoPoint;
  }
  emitChange: (value: GeoPoint) => any = noop;
  subscriptions: Subscription[] = [];
  formGroup: FormGroup;
  googleMapOptions: google.maps.MapOptions = {
    center: new GeoPoint().toGoogleMapsLatLng(),
    zoom: 8
  };
  isMapReady = false;

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
      this._geoPoint = value;
      this.formGroup.setValue({
        latitude: value.latitude,
        longitude: value.longitude
      });
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}

  onMapReady() {
    if (GeoPoint.isGeoPoint(this.geoPoint)) {
      this.googleMapOptions = {
        center: this.geoPoint.toGoogleMapsLatLng(),
        zoom: 12
      };
    }
    this.isMapReady = true;
  }

  onMapClick(mouseEvent: MouseEvent) {
    this.geoPoint = GeoPoint.fromGoogleMapsLatLng(mouseEvent.coords);
    this.formGroup.setValue(this.geoPoint.toJSON());
  }
}
