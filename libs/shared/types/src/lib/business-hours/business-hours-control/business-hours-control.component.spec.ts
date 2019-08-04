import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessHoursControlComponent } from './business-hours-control.component';
import { Component, DebugElement } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { By } from '@angular/platform-browser';
import { BusinessHours } from '../business-hours';
import { take } from 'rxjs/operators';
import { OpenHour } from '../open-hour';
import { TimeRange } from '../../time-range';
import { BusinessHoursControlPageObject } from './business-hours-control.po';

class BusinessHoursControlPageObjectJest extends BusinessHoursControlPageObject {
  debugElement: DebugElement;
  
  constructor(debugElement: DebugElement) {
    super();
    this.debugElement = debugElement;
  }

  clearAll() {
    this.debugElement.query(By.css(this.getSelector('buttonClearAll'))).nativeElement.click();
  }

  getOpenHours() {
    const openHoursDBElements = this.debugElement.queryAll(By.css(this.getSelector('openHour')));
    return openHoursDBElements.map(openHourDBElmt => {
      const weekDay = parseInt(openHourDBElmt.attributes['data-weekDay'], 10);
      const start = openHourDBElmt.attributes['data-start'];
      const end = openHourDBElmt.attributes['data-end'];
      return new OpenHour(weekDay, start, end);
    });
  }

  addOpenHour(openHour: OpenHour) {
    const selectWeekDay = this.debugElement.query(By.css(this.getSelector('selectWeekDay'))).nativeElement;
    const inputStart = this.debugElement.query(By.css(this.getSelector('inputStart'))).nativeElement;
    const inputEnd = this.debugElement.query(By.css(this.getSelector('inputEnd'))).nativeElement;
    const buttonAdd = this.debugElement.query(By.css(this.getSelector('buttonAdd'))).nativeElement;
    selectWeekDay.value = openHour.weekDay;
    inputStart.value = openHour.timeRange.start;
    inputEnd.value = openHour.timeRange.end;
    buttonAdd.click();
  }

  addOpenHourForAll7Days(start: Date, end: Date) {
    const selectWeekDay = this.debugElement.query(By.css(this.getSelector('selectWeekDay'))).nativeElement;
    const inputStart = this.debugElement.query(By.css(this.getSelector('inputStart'))).nativeElement;
    const inputEnd = this.debugElement.query(By.css(this.getSelector('inputEnd'))).nativeElement;
    const buttonAdd = this.debugElement.query(By.css(this.getSelector('buttonAdd'))).nativeElement;
    selectWeekDay.value = 8;
    inputStart.value = start;
    inputEnd.value = end;
    buttonAdd.click();
  }

  deleteOpenHourByIndex(index: number) {
    const selector = `${this.getSelector('buttonDelete')} [index="${index}"]`;
    this.debugElement.query(By.css(selector)).nativeElement.click();
  }
}

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
  let debugElement: DebugElement;
  const testBusinessHours: BusinessHours = BusinessHours.forge();
  let pageObject: BusinessHoursControlPageObject;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessHoursControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessHoursControlComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    pageObject = new BusinessHoursControlPageObjectJest(debugElement);
    component.businessHours = testBusinessHours;
    fixture.detectChanges();
  });

  it('can clear all open-hours', async done => {
    pageObject.clearAll()
    await fixture.whenStable()
    fixture.detectChanges();
    expect(pageObject.getOpenHours()).toHaveLength(0);
  });

  it('can add open-hours', async done => {
    pageObject.clearAll();
    const testOpenHour = OpenHour.forge();
    pageObject.addOpenHour(testOpenHour);
    await fixture.whenStable();
    fixture.detectChanges();
    const openHours = pageObject.getOpenHours();
    expect(openHours).toHaveLength(1);
    expect(openHours[0].toJSON()).toEqual(testOpenHour.toJSON());
    done();
  });

  it('can add open-hours for all 7 week days at once', async done => {
    const testTimeRange = TimeRange.forge();
    pageObject.clearAll();
    pageObject.addOpenHourForAll7Days(testTimeRange.start, testTimeRange.end);
    await fixture.whenStable();
    fixture.detectChanges();
    const openHours = pageObject.getOpenHours();
    expect(openHours).toHaveLength(7);
    for (const openHour of openHours) {
      expect(openHour.timeRange.format()).toEqual(testTimeRange.format());
    }
    done();
  });
  
  it('can delete an open-hour by index', async done => {
    const openHour1 = new OpenHour(0, '10:30', '12:20');
    const openHour2 = new OpenHour(1, '10:30', '12:20');
    pageObject.addOpenHour(openHour1);
    await fixture.whenStable();
    fixture.detectChanges();
    pageObject.addOpenHour(openHour2);
    await fixture.whenStable();
    fixture.detectChanges();
    pageObject.deleteOpenHourByIndex(0);
    const openHours = pageObject.getOpenHours();
    expect(openHours).toHaveLength(1);
    expect(openHours[0].toJSON()).toEqual(openHour2.toJSON());    
    done();
  });
});
