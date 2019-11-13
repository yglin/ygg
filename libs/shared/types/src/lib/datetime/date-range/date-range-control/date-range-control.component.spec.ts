import * as moment from 'moment';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DateRangeControlComponent } from './date-range-control.component';
import { DateRangeControlPageObject } from './date-range-control.component.po';
import { DateRange } from '../date-range';
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
import { DATE_FORMATS } from '../../time-range';

class DateRangeControlPageObjectAngularJest extends DateRangeControlPageObject {
  tester: AngularJestTester;

  constructor(parentSelector: string, tester: AngularJestTester) {
    super(parentSelector);
    this.tester = tester;
  }

  async setValue(dateRange: DateRange) {
    // const dateRangeJSON = dateRange.toJSON();
    // console.log('Input below date range')
    // console.log(dateRangeJSON);
    await this.setStart(dateRange.start);
    await this.setEnd(dateRange.end);
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

  expectValue(dateRange: DateRange) {
    this.tester.expectInputValue(this.getSelector('inputStart'), moment(dateRange.start).format(DATE_FORMATS.display.dateInput));
    this.tester.expectInputValue(this.getSelector('inputEnd'), moment(dateRange.end).format(DATE_FORMATS.display.dateInput));
  }
}

@Component({
  selector: 'ygg-welcome-to-my-form',
  template:
    '<form [formGroup]="formGroup"><ygg-date-range-control formControlName="dateRange"></ygg-date-range-control></form>',
  styles: ['']
})
class MockFormComponent {
  formGroup: FormGroup;
  label: string;
  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      dateRange: null
    });
  }
}

describe('DateRangeControlComponent', () => {
  let component: DateRangeControlComponent;
  let formComponent: MockFormComponent;
  let fixture: ComponentFixture<MockFormComponent>;
  let debugElement: DebugElement;
  let pageObject: DateRangeControlPageObjectAngularJest;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [DateRangeControlComponent, MockFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    formComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component = debugElement.query(By.css('ygg-date-range-control'))
      .componentInstance;
    pageObject = new DateRangeControlPageObjectAngularJest(
      '',
      new AngularJestTester({
        fixture,
        debugElement
      })
    );
    fixture.detectChanges();
  });

  it('should read value from parent form', async done => {
    const testDateRange = DateRange.forge();
    formComponent.formGroup.get('dateRange').setValue(testDateRange);
    await fixture.whenStable();
    fixture.detectChanges();
    pageObject.expectValue(testDateRange);
    done();
  });

  it('should output changed value to parent form', async done => {
    const testDateRange = DateRange.forge();
    await pageObject.setValue(testDateRange);
    await fixture.whenStable();
    fixture.detectChanges();
    const dateRange: DateRange = formComponent.formGroup.get('dateRange').value;
    expect(dateRange.toJSON()).toEqual(testDateRange.toJSON());
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
  //   const dateRange: DateRange = formComponent.formGroup.get('dateRange').value;
  //   expect(dateRange.start).toEqual(endDate);
  //   expect(dateRange.end).toEqual(startDate);
  //   done();
  // });

  // it('should open picker dialog and pass current value', async done => {
  //   const testDateRange = DateRange.forge();
  //   await pageObject.setValue(testDateRange);
  //   await pageObject.openPickerDialog();
  //   expect(mockDateRangeControlDialogComponent.dateRange.toJSON()).toEqual(testDateRange.toJSON());
  //   done();
  // });

  // it('should update value received from dialog close', async done => {
  //   const testDateRange = DateRange.forge();
  //   await pageObject.openPickerDialog();
  //   mockDateRangeControlDialogComponent.dateRange = testDateRange;
  //   await mockDateRangeControlDialogComponent.close();
  //   expect(component.dateRange.toJSON()).toEqual(testDateRange);
  //   done();
  // });
});
