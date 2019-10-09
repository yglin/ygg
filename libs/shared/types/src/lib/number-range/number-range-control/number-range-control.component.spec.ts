// import * as moment from 'moment';
import 'hammerjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberRangeControlComponent } from './number-range-control.component';
import { NumberRangeControlPageObject } from './number-range-control.component.po';
import { NumberRange } from '../number-range';
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
import { FlexLayoutModule } from '@angular/flex-layout';

class NumberRangeControlPageObjectAngularJest extends NumberRangeControlPageObject {
  tester: AngularJestTester;

  constructor(parentSelector: string, tester: AngularJestTester) {
    super(parentSelector);
    this.tester = tester;
  }

  async setValue(numberRange: NumberRange) {
    await this.setMin(numberRange.min);
    await this.setMax(numberRange.max);
    return Promise.resolve();
  }

  async setMin(min: number) {
    return this.tester.inputText(
      this.getSelector('inputMin'),
      min.toString()
    );
  }

  async setMax(max: number) {
    return this.tester.inputText(this.getSelector('inputMax'), max.toString());
  }
}

@Component({
  selector: 'ygg-welcome-to-my-form',
  template:
    '<form [formGroup]="formGroup"><ygg-number-range-control formControlName="numberRange"></ygg-number-range-control></form>',
  styles: ['']
})
class MockFormComponent {
  formGroup: FormGroup;
  label: string;
  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      numberRange: null
    });
  }
}

describe('NumberRangeControlComponent', () => {
  let component: NumberRangeControlComponent;
  let formComponent: MockFormComponent;
  let fixture: ComponentFixture<MockFormComponent>;
  let debugElement: DebugElement;
  let pageObject: NumberRangeControlPageObjectAngularJest;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, FlexLayoutModule, SharedUiNgMaterialModule],
      declarations: [NumberRangeControlComponent, MockFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    formComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component = debugElement.query(By.css('ygg-number-range-control'))
      .componentInstance;
    pageObject = new NumberRangeControlPageObjectAngularJest(
      '',
      new AngularJestTester({
        fixture,
        debugElement
      })
    );
    fixture.detectChanges();
  });

  it('should read value from parent form', async done => {
    const testNumberRange = NumberRange.forge();
    formComponent.formGroup.get('numberRange').setValue(testNumberRange);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.numberRange.toJSON()).toEqual(testNumberRange.toJSON());
    done();
  });

  it('should output changed value to parent form', async done => {
    const testNumberRange = NumberRange.forge();
    await pageObject.setValue(testNumberRange);
    await fixture.whenStable();
    fixture.detectChanges();
    const numberRange: NumberRange = formComponent.formGroup.get('numberRange')
      .value;
    expect(numberRange.toJSON()).toEqual(testNumberRange.toJSON());
    done();
  });
});
