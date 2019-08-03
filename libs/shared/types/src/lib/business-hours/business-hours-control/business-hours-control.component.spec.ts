import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { range } from 'lodash';
import { BusinessHoursControlComponent } from './business-hours-control.component';
import { Component, DebugElement } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { By } from '@angular/platform-browser';
import { BusinessHours } from '../business-hours';
import { take } from 'rxjs/operators';
import { OpenHour } from '../open-hour';
import { TimeRange } from '../../time-range';

describe('BusinessHoursControlComponent as Reactive Form Controller(ControlValueAccessor)', () => {
  @Component({
    selector: 'ygg-welcome-to-my-form',
    template:
      '<form [formGroup]="formGroup"><ygg-business-hours-control formControlName="myBusinessHours" [label]="businessHoursLabel"></ygg-business-hours-control></form>',
    styles: ['']
  })
  class MockFormComponent {
    formGroup: FormGroup;
    businessHoursLabel: string;
    constructor(private formBuilder: FormBuilder) {
      this.formGroup = this.formBuilder.group({
        myBusinessHours: null
      });
    }
  }

  let formComponent: MockFormComponent;
  let component: BusinessHoursControlComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<MockFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [BusinessHoursControlComponent, MockFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    debugElement = fixture.debugElement;
    formComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(BusinessHoursControlComponent))
      .componentInstance;
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    fixture.detectChanges();
  });

  it('should show @Input() label', async done => {
    formComponent.businessHoursLabel = 'BaBaYaGa';
    await fixture.whenStable();
    fixture.detectChanges();
    const spanLabel: HTMLElement = debugElement.query(By.css('.control-label span')).nativeElement;
    expect(spanLabel.textContent).toEqual(formComponent.businessHoursLabel);
    done();
  });
  

  it('should read value from parent form', async done => {
    const testBusinessHours = BusinessHours.forge();
    formComponent.formGroup.get('myBusinessHours').setValue(testBusinessHours);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.businessHours).toBe(testBusinessHours);
    done();
  });

  it('should output changed value to parent form', async done => {
    const testBusinessHours = BusinessHours.forge();
    formComponent.formGroup
      .get('myBusinessHours')
      .valueChanges.pipe(take(1))
      .subscribe(value => {
        expect(value).toBe(testBusinessHours);
        done();
      });
    component.businessHours = testBusinessHours;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should output change after each operation', done => {
    const testBusinessHours = BusinessHours.forge();
    component.businessHours = testBusinessHours;
    formComponent.formGroup
      .get('myBusinessHours')
      .valueChanges.pipe(take(2))
      .subscribe(
        businessHours => {
          expect(businessHours.toJSON()).toEqual(component.businessHours.toJSON());
        },
        () => {},
        () => done()
      );
    component.clearAll();
    component.addOpenHour(OpenHour.forge());
  });
});

describe('BusinessHoursControlComponent', () => {
  let component: BusinessHoursControlComponent;
  let fixture: ComponentFixture<BusinessHoursControlComponent>;
  const testBusinessHours: BusinessHours = BusinessHours.forge();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessHoursControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessHoursControlComponent);
    component = fixture.componentInstance;
    component.businessHours = testBusinessHours;
    fixture.detectChanges();
  });

  it('can clear all open-hours', () => {
    component.clearAll();
    expect(component.businessHours.getOpenHours()).toHaveLength(0);
  });

  it('can add open-hours', async done => {
    component.clearAll();
    const testOpenHour = OpenHour.forge();
    component.addOpenHour(testOpenHour);
    expect(component.businessHours.getOpenHours()).toHaveLength(1);
    const openHour1 = component.businessHours.getOpenHours()[0];
    expect(openHour1.toJSON()).toEqual(testOpenHour.toJSON());
    done();
  });

  it('can add open-hours for all 7 week days at once', async done => {
    const testTimeRange = TimeRange.forge();
    const openHours7Days = range(7).map(i => new OpenHour(i, testTimeRange));
    component.clearAll();
    component.addOpenHourForAll7Days(testTimeRange.start, testTimeRange.end);
    const openHours = component.businessHours.getOpenHours();
    expect(JSON.stringify(openHours)).toEqual(JSON.stringify(openHours7Days));    
    done();
  });
  
  it('can delete an open-hour by index', async done => {
    const openHour1 = new OpenHour(0, '10:30', '12:20');
    const openHour2 = new OpenHour(1, '10:30', '12:20');
    component.addOpenHour(openHour1);
    component.addOpenHour(openHour2);
    component.deleteOpenHour(1);
    const openHours = component.businessHours.getOpenHours();
    expect(JSON.stringify(openHours)).toEqual(JSON.stringify([openHour1]));    
    done();
  });
});
