import * as moment from 'moment';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DateRangePickerComponent } from './date-range-picker.component';
import { DateRangePickerPageObject } from './date-range-picker.component.po';
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
// import { DateRangePickerDialogComponent } from './date-range-picker-dialog/date-range-picker-dialog.component';
// import { of } from 'rxjs';
// import { YggDialogService } from '@ygg/shared/ui/widgets';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';

class DateRangePickerPageObjectAngularJest extends DateRangePickerPageObject {
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
    const startDateString = moment(startDate).format(DateRange.format);
    return this.tester.inputText(
      this.getSelector('inputStart'),
      startDateString
    );
  }

  async setEnd(endDate: Date) {
    const endDateString = moment(endDate).format(DateRange.format);
    return this.tester.inputText(
      this.getSelector('inputEnd'),
      endDateString
    );
  }

  expectValue(dateRange: DateRange) {
    this.tester.expectInputValue(this.getSelector('inputStart'), moment(dateRange.start).format('L'));
    this.tester.expectInputValue(this.getSelector('inputEnd'), moment(dateRange.end).format('L'));
  }
}

// class MockDateRangePickerDialogComponent {
//   dateRange: DateRange;
//   afterClosed() {
//     return of(this.dateRange);
//   }
// }

// @Injectable()
// class MockYggDialogService {
//   mockDateRangePickerDialogComponent = new MockDateRangePickerDialogComponent();
//   open() {
//     return this.mockDateRangePickerDialogComponent;
//   }
// }

@Component({
  selector: 'ygg-welcome-to-my-form',
  template:
    '<form [formGroup]="formGroup"><ygg-date-range-picker formControlName="dateRange"></ygg-date-range-picker></form>',
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

describe('DateRangePickerComponent', () => {
  let component: DateRangePickerComponent;
  let formComponent: MockFormComponent;
  let fixture: ComponentFixture<MockFormComponent>;
  let debugElement: DebugElement;
  let pageObject: DateRangePickerPageObjectAngularJest;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [DateRangePickerComponent, MockFormComponent]
      // providers: [
      //   {
      //     provide: YggDialogService,
      //     useClass: MockYggDialogService
      //   }
      // ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    formComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component = debugElement.query(By.css('ygg-date-range-picker'))
      .componentInstance;
    pageObject = new DateRangePickerPageObjectAngularJest(
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
  //   expect(mockDateRangePickerDialogComponent.dateRange.toJSON()).toEqual(testDateRange.toJSON());
  //   done();
  // });

  // it('should update value received from dialog close', async done => {
  //   const testDateRange = DateRange.forge();
  //   await pageObject.openPickerDialog();
  //   mockDateRangePickerDialogComponent.dateRange = testDateRange;
  //   await mockDateRangePickerDialogComponent.close();
  //   expect(component.dateRange.toJSON()).toEqual(testDateRange);
  //   done();
  // });
});
