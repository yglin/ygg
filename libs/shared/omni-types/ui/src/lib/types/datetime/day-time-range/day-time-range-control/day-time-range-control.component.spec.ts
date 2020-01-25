import * as moment from 'moment';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTimeRangeControlComponent } from './day-time-range-control.component';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { Component, DebugElement, Injectable } from '@angular/core';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { By } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { of } from 'rxjs';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { DayTimeRange } from '../day-time-range';
import { MockComponent } from 'ng-mocks';
import { DayTimeControlComponent } from '../../day-time/day-time-control/day-time-control.component';

describe('DayTimeRangeControlComponent as Reactive Form Controller(ControlValueAccessor)', () => {
  @Component({
    selector: 'ygg-welcome-to-my-form',
    template:
      '<form [formGroup]="formGroup"><ygg-day-time-range-control formControlName="myDayTimeRange" [label]="timeLabel"></ygg-day-time-range-control></form>',
    styles: ['']
  })
  class MockFormComponent {
    formGroup: FormGroup;
    timeLabel: string;
    constructor(private formBuilder: FormBuilder) {
      this.formGroup = this.formBuilder.group({
        myDayTimeRange: null
      });
    }
  }

  let formComponent: MockFormComponent;
  let component: DayTimeRangeControlComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<MockFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [
        DayTimeRangeControlComponent,
        MockFormComponent,
        MockComponent(DayTimeControlComponent)
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    debugElement = fixture.debugElement;
    formComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(DayTimeRangeControlComponent))
      .componentInstance;
    // jest.spyOn(window, 'confirm').mockImplementation(() => true);

    fixture.detectChanges();
  });

  it('should show @Input() label', async done => {
    formComponent.timeLabel = 'KuKuGaGa';
    await fixture.whenStable();
    fixture.detectChanges();
    const spanLabel: HTMLElement = debugElement.query(
      By.css('.control-label span')
    ).nativeElement;
    expect(spanLabel.textContent).toEqual(formComponent.timeLabel);
    done();
  });

  it('should read value from parent form', async done => {
    const testTimeRange = DayTimeRange.forge();
    formComponent.formGroup.get('myDayTimeRange').setValue(testTimeRange);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.dayTimeRange.toJSON()).toEqual(testTimeRange.toJSON());
    done();
  });

  it('should output changed value to parent form', async done => {
    const testTimeRange = DayTimeRange.forge();
    component.formGroup.setValue({
      start: testTimeRange.start,
      end: testTimeRange.end
    });
    await fixture.whenStable();
    fixture.detectChanges();
    const result: DayTimeRange = new DayTimeRange(
      formComponent.formGroup.get('myDayTimeRange').value
    );
    expect(result.toJSON()).toEqual(testTimeRange.toJSON());
    done();
  });
});
