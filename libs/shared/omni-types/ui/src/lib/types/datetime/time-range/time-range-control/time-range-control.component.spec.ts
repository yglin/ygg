import * as moment from 'moment';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeRangeControlComponent } from './time-range-control.component';
import { TimeRangeControlPageObject } from './time-range-control.component.po';
import { TimeRange } from '@ygg/shared/omni-types/core';
import { AngularJestTester } from '@ygg/shared/test/angular-jest';
import { Component, DebugElement, Injectable } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { DATE_FORMATS } from '@ygg/shared/omni-types/core';

class TimeRangeControlPageObjectAngularJest extends TimeRangeControlPageObject {
  tester: AngularJestTester;

  constructor(parentSelector: string, tester: AngularJestTester) {
    super(parentSelector);
    this.tester = tester;
  }

  async setValue(TimeRange: TimeRange) {
    // const TimeRangeJSON = TimeRange.toJSON();
    // console.log('Input below date range')
    // console.log(TimeRangeJSON);
    await this.setStart(TimeRange.start);
    await this.setEnd(TimeRange.end);
    return Promise.resolve();
  }

  async setStart(startDate: Date) {
    const startDateString = moment(startDate).format(DATE_FORMATS.parse.dateInput[0]);
    return this.tester.inputText(
      this.getSelector('inputStart'),
      startDateString
    );
  }

  async setEnd(endDate: Date) {
    const endDateString = moment(endDate).format(DATE_FORMATS.parse.dateInput[0]);
    return this.tester.inputText(
      this.getSelector('inputEnd'),
      endDateString
    );
  }

  expectValue(TimeRange: TimeRange) {
    this.tester.expectInputValue(this.getSelector('inputStart'), moment(TimeRange.start).format(DATE_FORMATS.display.dateInput));
    this.tester.expectInputValue(this.getSelector('inputEnd'), moment(TimeRange.end).format(DATE_FORMATS.display.dateInput));
  }
}

@Component({
  selector: 'ygg-welcome-to-my-form',
  template:
    '<form [formGroup]="formGroup"><ygg-time-range-control formControlName="TimeRange"></ygg-time-range-control></form>',
  styles: ['']
})
class MockFormComponent {
  formGroup: FormGroup;
  label: string;
  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      TimeRange: null
    });
  }
}

describe('TimeRangeControlComponent', () => {
  let component: TimeRangeControlComponent;
  let formComponent: MockFormComponent;
  let fixture: ComponentFixture<MockFormComponent>;
  let debugElement: DebugElement;
  let pageObject: TimeRangeControlPageObjectAngularJest;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [TimeRangeControlComponent, MockFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    formComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component = debugElement.query(By.css('ygg-time-range-control'))
      .componentInstance;
    pageObject = new TimeRangeControlPageObjectAngularJest(
      '',
      new AngularJestTester({
        fixture,
        debugElement
      })
    );
    fixture.detectChanges();
  });

  it('should read value from parent form', async done => {
    const testTimeRange = TimeRange.forge();
    formComponent.formGroup.get('TimeRange').setValue(testTimeRange);
    await fixture.whenStable();
    fixture.detectChanges();
    pageObject.expectValue(testTimeRange);
    done();
  });

  it('should output changed value to parent form', async done => {
    const testTimeRange = TimeRange.forge();
    await pageObject.setValue(testTimeRange);
    await fixture.whenStable();
    fixture.detectChanges();
    const timeRange: TimeRange = formComponent.formGroup.get('TimeRange').value;
    expect(timeRange.toJSON()).toEqual(testTimeRange.toJSON());
    done();
  });

  // Turn this feature off because it confuses user
  // it('should swap end and start date if end date before start', async done => {
  //   const startDate = moment()
  //     .add(10, 'day')
  //     .startOf('day')
  //     .toDate();
  //   const endDate = moment()
  //     .startOf('day')
  //     .toDate();
  //   await pageObject.setStart(startDate);
  //   await pageObject.setEnd(endDate);
  //   await fixture.whenStable();
  //   fixture.detectChanges();
  //   const TimeRange: TimeRange = formComponent.formGroup.get('TimeRange').value;
  //   expect(TimeRange.start).toEqual(endDate);
  //   expect(TimeRange.end).toEqual(startDate);
  //   done();
  // });

  // it('should open picker dialog and pass current value', async done => {
  //   const testTimeRange = TimeRange.forge();
  //   await pageObject.setValue(testTimeRange);
  //   await pageObject.openPickerDialog();
  //   expect(mockTimeRangeControlDialogComponent.TimeRange.toJSON()).toEqual(testTimeRange.toJSON());
  //   done();
  // });

  // it('should update value received from dialog close', async done => {
  //   const testTimeRange = TimeRange.forge();
  //   await pageObject.openPickerDialog();
  //   mockTimeRangeControlDialogComponent.TimeRange = testTimeRange;
  //   await mockTimeRangeControlDialogComponent.close();
  //   expect(component.TimeRange.toJSON()).toEqual(testTimeRange);
  //   done();
  // });
});
