import { isArray, isEmpty } from 'lodash';
import { Component, OnDestroy, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { Subscription, noop, merge, of, Subject } from 'rxjs';
import { Address, Location, GeoPoint } from '@ygg/shared/geography/core';
import { debounceTime, filter, switchMap, tap, finalize } from 'rxjs/operators';
import { GeocodeService } from '../geocode.service';
import { YggDialogContentComponent } from '@ygg/shared/ui/widgets';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
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
export class LocationControlComponent
  implements
    OnInit,
    OnDestroy,
    ControlValueAccessor,
    YggDialogContentComponent {
  @Input() label: string;
  emitChange: (value: Location) => any = noop;
  formGroup: FormGroup;
  subscriptions: Subscription[] = [];
  isSyncMode = false;
  isSyncing = false;
  geocodedGeoPoints: GeoPoint[] = [];
  currentGeoPointIndex = 0;
  dialogData: Location;
  dialogOutput$ = new Subject<Location>();

  private _location: Location = new Location();
  set location(value: Location) {
    if (value) {
      this._location = value;
      this.emitChange(this._location);
      this.dialogOutput$.next(this._location);
    }
  }
  get location(): Location {
    return this._location;
  }

  constructor(
    private formBuilder: FormBuilder,
    private geocodeService: GeocodeService
  ) {
    this.formGroup = this.formBuilder.group({
      address: new Address(),
      geoPoint: new GeoPoint()
    });
    this.subscriptions.push(
      this.formGroup.valueChanges.subscribe(value => {
        if (Location.isLocation(value)) {
          this.location = new Location().fromJSON(value);
        }
      })
    );
    this.subscriptions.push(
      merge(
        this.formGroup.get('address').valueChanges,
        this.formGroup.get('geoPoint').valueChanges
      )
        .pipe(
          // tap(value => console.log(`Value changed ${JSON.stringify(value)}`)),
          // tap(() => console.log(`Sync mode is ${this.isSyncMode}`)),
          filter(
            value =>
              this.isSyncMode &&
              (Address.isAddress(value) || GeoPoint.isGeoPoint(value))
          ),
          // tap(value => console.log(`On sync mode and value is valid`)),
          debounceTime(1000),
          // tap(value => console.log(`Try to gecode: ${value}`)),
          tap(() => (this.isSyncing = true)),
          switchMap(value => {
            if (Address.isAddress(value)) {
              return this.geocodeService.addressToGeoPoints(value);
            } else if (GeoPoint.isGeoPoint(value)) {
              return this.geocodeService.geoPointToAddress(value);
            } else {
              return of(null);
            }
          }),
          tap(() => (this.isSyncing = false)),
          finalize(() => (this.isSyncing = false))
        )
        .subscribe(result => {
          if (result) {
            if (Address.isAddress(result)) {
              this.formGroup
                .get('address')
                .setValue(result, { emitEvent: false });
            }
            if (
              isArray(result) &&
              !isEmpty(result) &&
              GeoPoint.isGeoPoint(result[0])
            ) {
              this.geocodedGeoPoints = result;
              this.currentGeoPointIndex = 0;
              this.formGroup
                .get('geoPoint')
                .setValue(result[0], { emitEvent: false });
            }
            this.location = new Location().fromJSON(this.formGroup.value);
          }
        })
    );
  }

  ngOnInit() {
    if (Location.isLocation(this.dialogData)) {
      this.location = this.dialogData;
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: Location) {
    if (Location.isLocation(value)) {
      this._location = value;
      if (this.formGroup) {
        this.formGroup.setValue(value.toJSON());
      }
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}

  toNextGeoPoint() {
    this.currentGeoPointIndex =
      (this.currentGeoPointIndex + 1) % this.geocodedGeoPoints.length;
    const nextGeoPoint = this.geocodedGeoPoints[this.currentGeoPointIndex];
    this.formGroup.get('geoPoint').setValue(nextGeoPoint, { emitEvent: false });
    this.location = new Location().fromJSON(this.formGroup.value);
  }
}
