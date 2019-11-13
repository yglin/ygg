import * as moment from 'moment';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTimeControlComponent } from './day-time-control.component';
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
import { DayTime } from '../day-time';

@Injectable()
class MockAmazingTimePickerService {
  open() {
    return {
      afterClose: () => of('11:11')
    };
  }
}

describe('DayTimeControlComponent as Reactive Form Controller(ControlValueAccessor)', () => {
  @Component({
    selector: 'ygg-welcome-to-my-form',
    template:
      '<form [formGroup]="formGroup"><ygg-day-time-control formControlName="myDayTime" [label]="timeLabel"></ygg-day-time-control></form>',
    styles: ['']
  })
  class MockFormComponent {
    formGroup: FormGroup;
    timeLabel: string;
    constructor(private formBuilder: FormBuilder) {
      this.formGroup = this.formBuilder.group({
        myDayTime: null
      });
    }
  }

  let formComponent: MockFormComponent;
  let component: DayTimeControlComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<MockFormComponent>;
  let mockAmazingTimePickerService: MockAmazingTimePickerService;
  let inputHour: HTMLInputElement;
  let inputMinute: HTMLInputElement;
  let buttonOpenPicker: HTMLButtonElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [DayTimeControlComponent, MockFormComponent],
      providers: [
        {
          provide: AmazingTimePickerService,
          useClass: MockAmazingTimePickerService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    debugElement = fixture.debugElement;
    formComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(DayTimeControlComponent))
      .componentInstance;
    mockAmazingTimePickerService = TestBed.get(AmazingTimePickerService);
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    inputHour = debugElement.query(By.css('input#hour')).nativeElement;
    inputMinute = debugElement.query(By.css('input#minute')).nativeElement;
    buttonOpenPicker = debugElement.query(By.css('button#time-picker'))
      .nativeElement;

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
    const testTime = DayTime.forge();
    formComponent.formGroup.get('myDayTime').setValue(testTime);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.dayTime).toBe(testTime);
    done();
  });

  it('should output changed value to parent form', async done => {
    const testTime = DayTime.forge();
    formComponent.formGroup
      .get('myDayTime')
      .valueChanges.pipe(take(1))
      .subscribe(value => {
        expect(value).toBe(testTime);
        done();
      });
    component.dayTime = testTime;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('can set hour and minute, by separated inputs', async done => {
    inputHour.value = '10';
    inputHour.dispatchEvent(new Event('input'));
    inputMinute.value = '30';
    inputMinute.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
    const result: DayTime = formComponent.formGroup.get('myDayTime').value;
    expect(result.format()).toEqual('10:30');
    done();
  });

  it('should restirct hour between 0 - 23', async done => {
    inputHour.value = '-1';
    inputHour.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(inputHour.value).toBe('0');
    inputHour.value = '24';
    inputHour.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(inputHour.value).toBe('23');
    done();
  });

  it('should restirct minute between 0 - 59', async done => {
    inputMinute.value = '-1';
    inputMinute.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(inputMinute.value).toBe('0');
    inputMinute.value = '60';
    inputMinute.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(inputMinute.value).toBe('59');
    done();
  });

  it('can open dialog for some fancy time picker', async done => {
    const testTime = DayTime.forge();
    jest.spyOn(mockAmazingTimePickerService, 'open').mockImplementation(() => {
      return {
        afterClose: () => of(testTime.format())
      };
    });
    buttonOpenPicker.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const result: DayTime = formComponent.formGroup.get('myDayTime').value;
    expect(mockAmazingTimePickerService.open).toHaveBeenCalled();
    expect(result.toJSON()).toEqual(
      testTime.toJSON()
    );
    done();
  });
});
