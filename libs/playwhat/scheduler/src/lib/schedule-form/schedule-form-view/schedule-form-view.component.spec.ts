import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SharedTypesModule } from '@ygg/shared/types';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import * as moment from 'moment';

import { Schedule } from '../../models';
import { ScheduleForm } from '../schedule-form';

import { ScheduleFormViewComponent } from './schedule-form-view.component';

function getFieldElement(
  dbElement: DebugElement,
  fieldName: string
): HTMLElement {
  return dbElement.query(By.css(`#${fieldName} .value`)).nativeElement;
}

function countPluralField(dbElement: DebugElement, fieldName: string): number {
  return dbElement.query(By.css(`#${fieldName}`)).queryAll(By.css('.value'))
    .length;
}

function getValueText(dbElement: DebugElement, fieldName: string): string {
  return getFieldElement(dbElement, fieldName).textContent;
}

describe('ScheduleFormViewComponent', () => {
  let component: ScheduleFormViewComponent;
  let fixture: ComponentFixture<ScheduleFormViewComponent>;
  let testScheduleForm: ScheduleForm;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleFormViewComponent],
      imports: [SharedUiNgMaterialModule, SharedTypesModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    testScheduleForm = ScheduleForm.forge();
    fixture = TestBed.createComponent(ScheduleFormViewComponent);
    component = fixture.componentInstance;
    component.scheduleForm = testScheduleForm;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should display correct data', () => {
    const startDateText = moment(testScheduleForm.dateRange.start).format(
      'YYYY/MM/DD'
    );
    const endDateText = moment(testScheduleForm.dateRange.end).format(
      'YYYY/MM/DD'
    );
    expect(getFieldElement(debugElement, 'dateRange').innerHTML).toContain(
      startDateText
    );
    expect(getFieldElement(debugElement, 'dateRange').innerHTML).toContain(
      endDateText
    );
    expect(getValueText(debugElement, 'numParticipants')).toEqual(
      testScheduleForm.numParticipants.toString()
    );
    expect(getValueText(debugElement, 'numElders')).toEqual(
      testScheduleForm.numElders.toString()
    );
    expect(getValueText(debugElement, 'numKids')).toEqual(
      testScheduleForm.numKids.toString()
    );
    expect(getFieldElement(debugElement, 'totalBudget').innerHTML).toContain(
      testScheduleForm.totalBudget.min.toString()
    );
    expect(getFieldElement(debugElement, 'totalBudget').innerHTML).toContain(
      testScheduleForm.totalBudget.max.toString()
    );
    expect(getValueText(debugElement, 'groupName')).toEqual(
      testScheduleForm.groupName
    );

    expect(countPluralField(debugElement, 'contacts')).toEqual(
      testScheduleForm.contacts.length
    );

    expect(getValueText(debugElement, 'transpotation')).toEqual(
      testScheduleForm.transpotation
    );
    expect(getValueText(debugElement, 'transpotationHelp')).toEqual(
      testScheduleForm.transpotationHelp
    );
    expect(getValueText(debugElement, 'accommodationHelp')).toEqual(
      testScheduleForm.accommodationHelp
    );

    expect(countPluralField(debugElement, 'likes')).toEqual(testScheduleForm.likes.length);

    expect(getValueText(debugElement, 'likesDescription')).toEqual(
      testScheduleForm.likesDescription
    );
  });
});
