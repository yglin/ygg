import 'hammerjs';
import { range } from 'lodash';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationControlComponent } from './location-control.component';
import { Component, DebugElement, Injectable } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { By } from '@angular/platform-browser';
import { Location } from '../location';
import { Address } from '../address';
import { GeoPoint } from '../geo-point';
import { LocationControlComponentPageObject } from './location-control.component.po';
import { AngularJestTester } from '@ygg/shared/infra/test-utils';
import { GeocodeService } from '../geocode.service';
import { AddressControlComponent } from '../address';
import { GeoPointControlComponent } from '../geo-point';
import { MockAgmMapComponent, MockAgmMarkerComponent } from '../geo-point/index.po';
import { Observable, of } from 'rxjs';

@Injectable()
class MockGeocodeService {
  geoPointToAddress(geoPoint: GeoPoint): Observable<Address> {
    return of(null);
  }
  addressToGeoPoints(address: Address): Observable<GeoPoint[]> {
    return of([]);
  }
}

describe('LocationControlComponent as Reactive Form Controller(ControlValueAccessor)', () => {
  @Component({
    selector: 'ygg-welcome-to-my-form',
    template:
      '<form [formGroup]="formGroup"><ygg-location-control formControlName="location" [label]="label"></ygg-location-control></form>',
    styles: ['']
  })
  class MockFormComponent {
    formGroup: FormGroup;
    label: string;
    constructor(private formBuilder: FormBuilder) {
      this.formGroup = this.formBuilder.group({
        location: null
      });
    }
  }

  let formComponent: MockFormComponent;
  let component: LocationControlComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<MockFormComponent>;

  let pageObject: LocationControlComponentPageObject;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [
        MockFormComponent,
        LocationControlComponent,
        AddressControlComponent,
        MockAgmMapComponent,
        MockAgmMarkerComponent,
        GeoPointControlComponent
      ],
      providers: [{ provide: GeocodeService, useClass: MockGeocodeService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    debugElement = fixture.debugElement;
    formComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(LocationControlComponent))
      .componentInstance;
    jest.spyOn(window, 'confirm').mockImplementation(() => true);

    const tester = new AngularJestTester({ debugElement });
    pageObject = new LocationControlComponentPageObject(tester, '');
    fixture.detectChanges();
  });

  it('should show @Input() label', async done => {
    formComponent.label = 'BaBaYGG';
    await fixture.whenStable();
    fixture.detectChanges();
    // TODO: Add test for your custom label's visibility
    expect(pageObject.getLabel()).toEqual(formComponent.label);
    done();
  });

  it('should read value from parent form', async done => {
    const testLocation = Location.forge();
    formComponent.formGroup.get('location').setValue(testLocation);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.location.toJSON()).toEqual(testLocation.toJSON());
    done();
  });

  it('should output changed value to parent form', async done => {
    const testLocation = Location.forge();
    pageObject.setValue(testLocation);
    await fixture.whenStable();
    fixture.detectChanges();
    const location: Location = formComponent.formGroup.get('location').value;
    expect(location.geoPoint.toJSON()).toEqual(testLocation.geoPoint.toJSON());
    expect(location.address.getFullAddress()).toEqual(testLocation.address.getFullAddress());
    done();
  });

  it('on sync mode, change address should geocode geo-points', async done => {
    pageObject.setSyncMode(true);
    await fixture.whenStable();
    fixture.detectChanges();
    const mockGeocodeService: MockGeocodeService = TestBed.get(GeocodeService);
    const stubAddress = Address.forge();
    const stubGeoPoint = GeoPoint.forge();
    jest.spyOn(mockGeocodeService, 'addressToGeoPoints').mockImplementation(() => of([stubGeoPoint]));
    pageObject.addressControl.setValue(stubAddress);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(mockGeocodeService.addressToGeoPoints).toHaveBeenCalled();
    const resultLocation: Location = formComponent.formGroup.get('location').value;
    expect(resultLocation.geoPoint.toJSON()).toEqual(stubGeoPoint.toJSON());
    done();
  });

  it('on sync mode, change geo-point should (reverse)geocode address', async done => {
    pageObject.setSyncMode(true);
    await fixture.whenStable();
    fixture.detectChanges();
    const mockGeocodeService: MockGeocodeService = TestBed.get(GeocodeService);
    const stubGeoPoint = GeoPoint.forge();
    const stubAddress = Address.forge();
    jest.spyOn(mockGeocodeService, 'geoPointToAddress').mockImplementation(() => of(stubAddress));
    pageObject.geoPointControl.setValue(stubGeoPoint);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(mockGeocodeService.geoPointToAddress).toHaveBeenCalledWith(stubGeoPoint);
    const resultLocation: Location = formComponent.formGroup.get('location').value;
    expect(resultLocation.address.getFullAddress()).toEqual(stubAddress.getFullAddress());
    done();
  });

  it('If geocoding address results to multiple geo-points, should be able to select one', async done => {
    jest.setTimeout(10000);
    pageObject.setSyncMode(true);
    await fixture.whenStable();
    fixture.detectChanges();
    const mockGeocodeService: MockGeocodeService = TestBed.get(GeocodeService);
    const stubAddress = Address.forge();
    const stubGeoPoints = range(3).map(() => GeoPoint.forge());
    jest.spyOn(mockGeocodeService, 'addressToGeoPoints').mockImplementation(() => of(stubGeoPoints));
    pageObject.addressControl.setValue(stubAddress);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(mockGeocodeService.addressToGeoPoints).toHaveBeenCalled();
    let resultLocation: Location;
    // Button to-next-geo-point should be visible
    const buttonNextGeoPoint: HTMLButtonElement = pageObject.getElement('buttonNextGeoPoint');
    expect(buttonNextGeoPoint.attributes['hidden']).toBeFalsy();
    // Switch to second one
    pageObject.toNextGeoPoint();
    await fixture.whenStable();
    fixture.detectChanges();
    resultLocation = formComponent.formGroup.get('location').value;
    expect(resultLocation.geoPoint.toJSON()).toEqual(stubGeoPoints[1].toJSON());
    // Switch to third one
    pageObject.toNextGeoPoint();
    await fixture.whenStable();
    fixture.detectChanges();
    resultLocation = formComponent.formGroup.get('location').value;
    expect(resultLocation.geoPoint.toJSON()).toEqual(stubGeoPoints[2].toJSON());
    // Loop back to first one
    pageObject.toNextGeoPoint();
    await fixture.whenStable();
    fixture.detectChanges();
    resultLocation = formComponent.formGroup.get('location').value;
    expect(resultLocation.geoPoint.toJSON()).toEqual(stubGeoPoints[0].toJSON());
    done();
  });
});
