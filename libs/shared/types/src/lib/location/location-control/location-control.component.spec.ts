import 'hammerjs';
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
import { Address } from '../../address';
import { GeoPoint } from '../../geo-point';
import { AddressControlComponentPageObject } from "../../address/index.spec";
import { ControlPageObject, setInputText, setInputNumber, inputMethodsCollection } from '@ygg/shared/infra/test-utils';

class LocationControlComponentPageObject extends ControlPageObject<Location> {
  selector = '.location-control'
  selectors = {
    label: 'label'
  };

  addressControl: AddressControlComponentPageObject;

  setInput(value: Location, options: any) {

  }

}

@Injectable()
class MockGeocodeService {
  geoPointToAddress(geoPoint: GeoPoint): Address {
    return null;
  }
  addressToGeoPoints(address: Address): GeoPoint[] {
    return [];
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

  const pageObject = new LocationControlComponentPageObject('', inputMethodsCollection);
  let rawInput: HTMLInputElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [
        MockFormComponent, LocationControlComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    debugElement = fixture.debugElement;
    formComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(LocationControlComponent))
      .componentInstance;
    rawInput = debugElement.query(By.css(pageObject.getSelector('rawInput'))).nativeElement;
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    fixture.detectChanges();
  });

  it('should show @Input() label', async done => {
    formComponent.label = 'BaBaYGG';
    await fixture.whenStable();
    fixture.detectChanges();
    // TODO: Add test for your custom label's visibility
    const labelElement: HTMLElement = debugElement.query(By.css(pageObject.getSelector('label'))).nativeElement;
    expect(labelElement.textContent).toEqual(formComponent.label);
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
    component.location = testLocation;
    await fixture.whenStable();
    fixture.detectChanges();
    const location: Location = formComponent.formGroup.get(
      'location'
    ).value;
    expect(location.toJSON()).toEqual(testLocation.toJSON());
    done();
  });

  // it('on change address, should try to geocode geo-points', async done => {
  //   const mockGeocodeService: MockGeocodeService = TestBed.get(GeocodeService);
  //   const stubAddress = Address.forge();
  //   const stubGeoPoint = GeoPoint.forge();
  //   jest.spyOn(mockGeocodeService, 'addressToGeoPoints').mockImplementation(() => [stubGeoPoint]);
  //   setInputText(debugElement, pageObject.addressControl.getSelector('rawInput'), stubAddress.getFullAddress());
  //   await fixture.whenStable();
  //   fixture.detectChanges();
  //   expect(mockGeocodeService.addressToGeoPoints).toHaveBeenCalledWith(stubAddress.getFullAddress());
  //   const resultLocation: Location = formComponent.formGroup.get('location').value;
  //   expect(resultLocation.geoPoint.toJSON()).toEqual(stubGeoPoint.toJSON());
  //   done();
  // });
  
  // it('on change geo-point, should try to (reverse)geocode address', async done => {
  //   const mockGeocodeService: MockGeocodeService = TestBed.get(GeocodeService);
  //   const stubGeoPoint = GeoPoint.forge();
  //   const stubAddress = Address.forge();
  //   jest.spyOn(mockGeocodeService, 'addressToGeoPoints').mockImplementation(() => [stubGeoPoint]);
  //   setInputNumer(debugElement, pageObject.addressControl.getSelector('rawInput'), stubAddress.getFullAddress());
  //   await fixture.whenStable();
  //   fixture.detectChanges();
  //   expect(mockGeocodeService.addressToGeoPoints).toHaveBeenCalledWith(stubAddress.getFullAddress());
  //   const resultLocation: Location = formComponent.formGroup.get('location').value;
  //   expect(resultLocation.geoPoint.toJSON()).toEqual(stubGeoPoint.toJSON());
  //   done();
  // });
});
