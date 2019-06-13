import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';

import {ScheduleFormComponent} from './schedule-form.component';
import {ScheduleFormService} from './schedule-form.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedInfrastructureUtilityTypesModule } from '@ygg/shared/infrastructure/utility-types';

describe('ScheduleFormComponent', () => {
  let component: ScheduleFormComponent;
  let fixture: ComponentFixture<ScheduleFormComponent>;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule({
          declarations: [ScheduleFormComponent],
          imports: [FormsModule, ReactiveFormsModule, SharedUiWidgetsModule, SharedInfrastructureUtilityTypesModule],
          providers: [
            ScheduleFormService
          ],
          schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be invalid initially', () => {
    expect(component.formGroup.valid).toBeFalsy();
  });

  it('should require dateRange', () => {
    const dateRangeControl = component.formGroup.get('dateRange');
    expect(dateRangeControl.getError('required')).toBeTruthy();    
  });

  // it('should require numParticipants', () => {
  //   const numParticipantsControl = component.formGroup.get('numParticipants');
  //   expect(numParticipantsControl.getError('required')).toBeTruthy();
  // });
  
  // it('should require at least one contact', () => {
  //   const contactsControlsArray = component.formGroup.get('contacts');
  //   expect(contactsControlsArray.getError('required')).toBeTruthy();
  // });
  
});
