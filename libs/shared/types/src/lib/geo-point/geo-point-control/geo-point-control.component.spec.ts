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

class GeoPointControlComponentPageObject {
  selector = '.geo-point-control';
  selectors = {
    label: '.label',
    inputLatitude: 'input#latitude',
    inputLongitude: 'input#longitude'
  };

  getSelector(name?: string): string {
    if (name && name in this.selectors) {
      return `${this.selector} ${this.selectors[name]}`;
    } else {
      return `${this.selector}`;
    }
  }
}

@Component({
  selector: 'agm-map',
  template: '',
  styles: ['']
})
class MockAgmMapComponent {
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() zoom: number;
}

@Component({
  selector: 'agm-marker',
  template: '',
  styles: ['']
})
class MockAgmMarkerComponent {
  @Input() latitude: number;
  @Input() longitude: number;
}

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

  const pageObject = new GeoPointControlComponentPageObject();
  let rawInput: HTMLInputElement;

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
    rawInput = debugElement.query(By.css(pageObject.getSelector('rawInput')))
      .nativeElement;
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    fixture.detectChanges();
  });

  it('should show @Input() label', async done => {
    formComponent.label = 'BaBaYGG';
    await fixture.whenStable();
    fixture.detectChanges();
    // TODO: Add test for your custom label's visibility
    const labelElement: HTMLElement = debugElement.query(
      By.css(pageObject.getSelector('label'))
    ).nativeElement;
    expect(labelElement.textContent).toEqual(formComponent.label);
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
    component.geoPoint = testGeoPoint;
    await fixture.whenStable();
    fixture.detectChanges();
    const geoPoint: GeoPoint = formComponent.formGroup.get('geoPoint').value;
    expect(geoPoint.toJSON()).toEqual(testGeoPoint.toJSON());
    done();
  });

  it('can directly input latitude and longitude', async done => {
    const testGeoPoint = GeoPoint.forge();
    const inputLatitude: HTMLInputElement = debugElement.query(
      By.css(pageObject.getSelector('inputLatitude'))
    ).nativeElement;
    const inputLongitude: HTMLInputElement = debugElement.query(
      By.css(pageObject.getSelector('inputLongitude'))
    ).nativeElement;
    inputLatitude.value = testGeoPoint.latitude.toString();
    inputLatitude.dispatchEvent(new Event('input'));
    inputLongitude.value = testGeoPoint.longitude.toString();
    inputLongitude.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
    const result: GeoPoint = formComponent.formGroup.get('geoPoint').value;
    expect(result.toJSON()).toEqual(testGeoPoint.toJSON());
    done();
  });
});
