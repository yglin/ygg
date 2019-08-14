import 'hammerjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationControlComponent } from './location-control.component';
import { Component, DebugElement } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { By } from '@angular/platform-browser';
import { Location } from '../location';
import { MockComponent } from "ng-mocks";

class LocationControlComponentPageObject {
  selector = '.location-control'
  selectors = {};

  getSelector(name: string): string {
    if (name in this.selectors) {
      return `${this.selector} ${this.selectors[name]}`;
    } else {
      throw new Error(`${name} not in selectors`);
    }
  }
}

describe('LocationControlComponent as Reactive Form Controller(ControlValueAccessor)', () => {
  @Component({
    selector: 'ygg-welcome-to-my-form',
    template:
      '<form [formGroup]="formGroup"><ygg-location-control formControlName="location" [label]="locationLabel"></ygg-location-control></form>',
    styles: ['']
  })
  class MockFormComponent {
    formGroup: FormGroup;
    locationLabel: string;
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

  const pageObject = new LocationControlComponentPageObject();

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
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    fixture.detectChanges();
  });

  it('should show @Input() label', async done => {
    formComponent.locationLabel = 'BaBaYGG';
    await fixture.whenStable();
    fixture.detectChanges();
    const spanLabel: HTMLElement = debugElement.query(
      By.css('.control-label span')
    ).nativeElement;
    expect(spanLabel.textContent).toEqual(formComponent.locationLabel);
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

  // it('can mark geo-point by address', async done => {
  //   const stubPoint = GeoPoint.forge();
  //   const result: Location = formComponent.formGroup.get('location').value;
  //   expect(result.geoPoint.toJSON()).toEqual(stubPoint.toJSON());
  //   done();
  // });

  // it('can mark my geo-point', async done => {
  //   const stubMyGeoPint
  //   const result: Location = formComponent.formGroup.get('location').value;
  //   expect(result).toEqual(something);
  //   done();
  // });

});
