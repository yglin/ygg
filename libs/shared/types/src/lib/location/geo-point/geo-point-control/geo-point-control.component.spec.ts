import 'hammerjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeoPointControlComponent } from './geo-point-control.component';
import { Component, DebugElement, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { By } from '@angular/platform-browser';
import { GeoPoint } from '../geo-point';
import { GeoPointControlComponentPageObject } from "./geo-point-control.component.po";
import { MockAgmMapComponent, MockAgmMarkerComponent } from "../mock-agm-map.po";
import { AngularJestTester } from '@ygg/shared/infra/test-utils';

describe('GeoPointControlComponent as Reactive Form Controller(ControlValueAccessor)', () => {
  @Component({
    selector: 'ygg-welcome-to-my-form',
    template:
      '<form [formGroup]="formGroup"><ygg-geo-point-control formControlName="geoPoint" [label]="label"></ygg-geo-point-control></form>',
    styles: ['']
  })
  class MockFormComponent {
    formGroup: FormGroup;
    label: string;
    constructor(private formBuilder: FormBuilder) {
      this.formGroup = this.formBuilder.group({
        geoPoint: null
      });
    }
  }

  let formComponent: MockFormComponent;
  let component: GeoPointControlComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<MockFormComponent>;
  let pageObject: GeoPointControlComponentPageObject;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [
        MockFormComponent,
        GeoPointControlComponent,
        MockAgmMapComponent,
        MockAgmMarkerComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    debugElement = fixture.debugElement;
    formComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(GeoPointControlComponent))
      .componentInstance;
    jest.spyOn(window, 'confirm').mockImplementation(() => true);

    const tester = new AngularJestTester({ debugElement });
    pageObject = new GeoPointControlComponentPageObject(tester, '');

    fixture.detectChanges();
  });

  it('should show @Input() label', async done => {
    formComponent.label = 'BaBaYGG';
    await fixture.whenStable();
    fixture.detectChanges();
    expect(pageObject.getTextContent('label')).toEqual(formComponent.label);
    done();
  });

  it('should read value from parent form', async done => {
    const testGeoPoint = GeoPoint.forge();
    formComponent.formGroup.get('geoPoint').setValue(testGeoPoint);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.geoPoint.toJSON()).toEqual(testGeoPoint.toJSON());
    done();
  });

  it('should output changed value to parent form', async done => {
    const testGeoPoint = GeoPoint.forge();
    pageObject.setValue(testGeoPoint);
    await fixture.whenStable();
    fixture.detectChanges();
    const geoPoint: GeoPoint = formComponent.formGroup.get('geoPoint').value;
    expect(geoPoint.toJSON()).toEqual(testGeoPoint.toJSON());
    done();
  });

  it('can directly input latitude and longitude', async done => {
    const testGeoPoint = GeoPoint.forge();
    pageObject.setValue(testGeoPoint);
    await fixture.whenStable();
    fixture.detectChanges();
    const result: GeoPoint = formComponent.formGroup.get('geoPoint').value;
    expect(result.toJSON()).toEqual(testGeoPoint.toJSON());
    done();
  });
});
