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
import {
  YggDialogContentComponent,
  YggDialogService
} from '@ygg/shared/ui/widgets';
import { LocationControlComponent } from '../location-control/location-control.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-location-control-compact',
  templateUrl: './location-control-compact.component.html',
  styleUrls: ['./location-control-compact.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationControlCompactComponent),
      multi: true
    }
  ]
})
export class LocationControlCompactComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  emitChange: (value: Location) => any = noop;
  formGroup: FormGroup;
  subscription = new Subscription();

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

  constructor(
    private formBuilder: FormBuilder,
    private dialog: YggDialogService
  ) {
    this.formGroup = this.formBuilder.group({
      address: new Address(),
      geoPoint: new GeoPoint()
    });
    this.subscription.add(
      this.formGroup.valueChanges.subscribe(value => {
        // console.log(value);
        if (Location.isLocation(value)) {
          this.location = new Location().fromJSON(value);
        }
      })
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  writeValue(value: Location) {
    if (Location.isLocation(value)) {
      this._location = value;
      if (this.formGroup) {
        this.formGroup.setValue(value.toJSON(), { emitEvent: false });
      }
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}

  openLocationControlDialog() {
    const dialogRef = this.dialog.open(LocationControlComponent, {
      title: '在地圖上尋找地址',
      data: this.location
    });
    dialogRef.afterClosed().subscribe(location => {
      if (Location.isLocation(location)) {
        this.location = location;
        if (this.formGroup) {
          this.formGroup.setValue(location.toJSON(), { emitEvent: false });
        }
      }
    });
  }
}
