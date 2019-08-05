import 'hammerjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessHoursControlComponent } from './business-hours-control.component';
import { Component, DebugElement } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { By } from '@angular/platform-browser';
import { BusinessHours } from '../business-hours';
import { take } from 'rxjs/operators';
import { OpenHour } from '../open-hour';
import { TimeRange } from '../../time-range';
// import { BusinessHoursControlPageObject } from './business-hours-control.po';
import { TimeRangeControlComponent } from '../../time-range/time-range-control/time-range-control.component';
// import { TimeInputComponent } from 'libs/shared/ui/widgets/src/lib/time-input/time-input.component';
// import { of } from 'rxjs';
// import { AmazingTimePickerService } from 'amazing-time-picker';
import { MockComponent } from "ng-mocks";
import { OpenHourComponent } from '../open-hour/open-hour.component';

// class BusinessHoursControlPageObjectJest extends BusinessHoursControlPageObject {
//   debugElement: DebugElement;

//   constructor(debugElement: DebugElement) {
//     super();
//     this.debugElement = debugElement;
//   }

//   clearAll() {
//     this.debugElement
//       .query(By.css(this.getSelector('buttonClearAll')))
//       .nativeElement.click();
//   }

//   getOpenHours() {
//     const openHoursDBElements = this.debugElement.queryAll(
//       By.css(this.getSelector('openHour'))
//     );
//     return openHoursDBElements.map(openHourDBElmt => {
//       const weekDay = parseInt(openHourDBElmt.attributes['data-weekDay'], 10);
//       const start = openHourDBElmt.attributes['data-start'];
//       const end = openHourDBElmt.attributes['data-end'];
//       return new OpenHour(weekDay, start, end);
//     });
//   }

//   addOpenHour(openHour: OpenHour) {
//     const selectWeekDay = this.debugElement.query(
//       By.css(this.getSelector('selectWeekDay'))
//     ).nativeElement;
//     const inputStart = this.debugElement.query(
//       By.css(this.getSelector('inputStart'))
//     ).nativeElement;
//     const inputEnd = this.debugElement.query(
//       By.css(this.getSelector('inputEnd'))
//     ).nativeElement;
//     const buttonAdd = this.debugElement.query(
//       By.css(this.getSelector('buttonAdd'))
//     ).nativeElement;
//     selectWeekDay.value = openHour.weekDay;
//     inputStart.value = openHour.timeRange.start;
//     inputEnd.value = openHour.timeRange.end;
//     buttonAdd.click();
//   }

//   addOpenHourForAll7Days(start: Date, end: Date) {
//     const selectWeekDay = this.debugElement.query(
//       By.css(this.getSelector('selectWeekDay'))
//     ).nativeElement;
//     const inputStart = this.debugElement.query(
//       By.css(this.getSelector('inputStart'))
//     ).nativeElement;
//     const inputEnd = this.debugElement.query(
//       By.css(this.getSelector('inputEnd'))
//     ).nativeElement;
//     const buttonAdd = this.debugElement.query(
//       By.css(this.getSelector('buttonAdd'))
//     ).nativeElement;
//     selectWeekDay.value = 8;
//     inputStart.value = start;
//     inputEnd.value = end;
//     buttonAdd.click();
//   }

//   deleteOpenHourByIndex(index: number) {
//     const selector = `${this.getSelector('buttonDelete')} [index="${index}"]`;
//     this.debugElement.query(By.css(selector)).nativeElement.click();
//   }
// }

describe('BusinessHoursControlComponent as Reactive Form Controller(ControlValueAccessor)', () => {
  @Component({
    selector: 'ygg-welcome-to-my-form',
    template:
      '<form [formGroup]="formGroup"><ygg-business-hours-control formControlName="businessHours" [label]="businessHoursLabel"></ygg-business-hours-control></form>',
    styles: ['']
  })
  class MockFormComponent {
    formGroup: FormGroup;
    businessHoursLabel: string;
    constructor(private formBuilder: FormBuilder) {
      this.formGroup = this.formBuilder.group({
        businessHours: null
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
      declarations: [
        MockComponent(TimeRangeControlComponent),
        MockComponent(OpenHourComponent),
        BusinessHoursControlComponent,
        MockFormComponent
      ],
      // providers: [
      //   {
      //     provide: AmazingTimePickerService,
      //     useClass: MockAmazingTimePickerService
      //   }
      // ]
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
    const spanLabel: HTMLElement = debugElement.query(
      By.css('.control-label span')
    ).nativeElement;
    expect(spanLabel.textContent).toEqual(formComponent.businessHoursLabel);
    done();
  });

  it('should read value from parent form', async done => {
    const testBusinessHours = BusinessHours.forge();
    formComponent.formGroup.get('businessHours').setValue(testBusinessHours);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.businessHours).toBe(testBusinessHours);
    done();
  });

  it('should output changed value to parent form', async done => {
    const testBusinessHours = BusinessHours.forge();
    component.businessHours = testBusinessHours;
    await fixture.whenStable();
    fixture.detectChanges();
    const businessHours: BusinessHours = formComponent.formGroup.get(
      'businessHours'
    ).value;
    expect(businessHours).toBe(testBusinessHours);
    done();
  });

  it('can clear all open-hours', async done => {
    component.clearAll();
    await fixture.whenStable();
    fixture.detectChanges();
    const businessHours: BusinessHours = formComponent.formGroup.get(
      'businessHours'
    ).value;
    expect(businessHours.getOpenHours()).toHaveLength(0);
    done();
  });

  it('can add open-hours', async done => {
    component.clearAll();
    const testOpenHour = OpenHour.forge();
    component.formGroupOpenHour.patchValue(testOpenHour);
    component.addOpenHour();
    await fixture.whenStable();
    fixture.detectChanges();
    const businessHours: BusinessHours = formComponent.formGroup.get(
      'businessHours'
    ).value;
    const openHours = businessHours.getOpenHours();
    expect(openHours[0].toJSON()).toEqual(testOpenHour.toJSON());
    done();
  });

  it('can add open-hours for all 7 week days at once', async done => {
    const testTimeRange = TimeRange.forge();
    component.formGroupOpenHour.get('weekDay').setValue(7);
    component.formGroupOpenHour.get('timeRange').setValue(testTimeRange);
    component.addOpenHour();
    await fixture.whenStable();
    fixture.detectChanges();
    const businessHours: BusinessHours = formComponent.formGroup.get(
      'businessHours'
    ).value;
    const openHours = businessHours.getOpenHours();
    expect(openHours).toHaveLength(7);
    for (const openHour of openHours) {
      expect(openHour.timeRange.format()).toEqual(testTimeRange.format());
    }
    done();
  });

  it('can delete an open-hour by index', async done => {
    component.clearAll();
    const openHour1 = new OpenHour(0, '10:30', '12:20');
    component.formGroupOpenHour.patchValue(openHour1);
    component.addOpenHour();
    const openHour2 = new OpenHour(1, '10:30', '12:20');
    component.formGroupOpenHour.patchValue(openHour2);
    component.addOpenHour();
    component.deleteOpenHour(0);
    await fixture.whenStable();
    fixture.detectChanges();
    const businessHours: BusinessHours = formComponent.formGroup.get(
      'businessHours'
    ).value;
    const openHours = businessHours.getOpenHours();
    expect(openHours).toHaveLength(1);
    expect(openHours[0].toJSON()).toEqual(openHour2.toJSON());
    done();
  });

  it('can subtract from exist open-hours', async done => {
    component.clearAll();
    const openHour1 = new OpenHour(3, '10:30', '18:30');
    component.formGroupOpenHour.patchValue(openHour1);
    component.addOpenHour();
    const openHour2 = new OpenHour(3, '12:30', '14:00');
    component.formGroupOpenHour.patchValue(openHour2);
    component.subtractOpenHour();
    await fixture.whenStable();
    fixture.detectChanges();
    const businessHours: BusinessHours = formComponent.formGroup.get(
      'businessHours'
    ).value;
    const openHours = businessHours.getOpenHours();
    expect(openHours).toHaveLength(2);
    expect(openHours[0].timeRange.format()).toEqual('10:30 - 12:30');
    expect(openHours[1].timeRange.format()).toEqual('14:00 - 18:30');
    done();
  });

});