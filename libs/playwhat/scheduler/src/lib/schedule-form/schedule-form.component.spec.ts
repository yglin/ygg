import { last } from "lodash";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedTypesModule, DateRange, Contact, Tags } from '@ygg/shared/types';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';

import { ScheduleFormComponent } from './schedule-form.component';
import { ScheduleFormService } from './schedule-form.service';
import { ScheduleForm } from './schedule-form';
import { of, Observable, Subject, BehaviorSubject } from 'rxjs';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { ScheduleFormViewComponent } from './schedule-form-view/schedule-form-view.component';
import { User, AuthenticateService } from '@ygg/shared/user';

let testScheduleForm: ScheduleForm;
let loginUser: User;

@Injectable()
export class MockAuthenticateService {
  currentUser$ = new BehaviorSubject<User>(null);
  login() {
    this.currentUser$.next(loginUser);
  }
}

@Injectable()
export class MockScheduleFormService {
  get$() {
    return of(testScheduleForm);
  }
  upsert() {
    return Promise.resolve(testScheduleForm);
  }
  listLikes$() {
    return of(Tags.forge());
  }
}

describe('ScheduleFormComponent', () => {
  let component: ScheduleFormComponent;
  let fixture: ComponentFixture<ScheduleFormComponent>;

  beforeAll(() => {
    testScheduleForm = ScheduleForm.forge();
    loginUser = User.forge();
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleFormComponent, ScheduleFormViewComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedUiNgMaterialModule,
        SharedUiWidgetsModule,
        SharedTypesModule
      ],
      providers: [
        { provide: ScheduleFormService, useClass: MockScheduleFormService },
        { provide: AuthenticateService, useClass: MockAuthenticateService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });  

  it('should be invalid initially, require dateRange, numParticipants, and at least one contact', () => {
    expect(component.formGroup.valid).toBe(false);
    const dateRangeControl = component.formGroup.get('dateRange');
    expect(dateRangeControl.getError('required')).toBeTruthy();
    const numParticipantsControl = component.formGroup.get('numParticipants');
    expect(numParticipantsControl.getError('required')).toBeTruthy();
    const contactsControl = component.formGroup.get('contacts');
    expect(contactsControl.invalid).toBe(true);

    dateRangeControl.setValue(DateRange.forge());
    numParticipantsControl.setValue(87);
    contactsControl.setValue([Contact.forge()]);
    expect(component.formGroup.valid).toBe(true);
  });

  it('copy contact from current login', () => {
    // Initially current user is undefined
    expect(component.currentUser).toBeFalsy();
    // Become defined after login
    const authService = TestBed.get(AuthenticateService);
    authService.login();
    expect(component.currentUser).toBe(loginUser);

    component.substituteContactWithCurrentUser(0);
    const contact = component.contactsFormArray.at(0).value;
    expect(new Contact().fromUser(loginUser)).toEqual(contact);
  });
  
  it('should submit correct data from user input', () => {
    const formGroup = component.formGroup;

    const formControlNames = [
      'dateRange',
      'numParticipants',
      'numElders',
      'numKids',
      'totalBudget',
      'singleBudget',
      'dateRange',
      'groupName',
      'transpotation',
      'transpotationHelp',
      'accommodationHelp',
      'likes',
      'likesDescription'
    ];
    for (const controlName of formControlNames) {
      formGroup.get(controlName).setValue(testScheduleForm[controlName]);
    }
    component.setContacts(testScheduleForm.contacts);
    
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    component.onSubmit.subscribe((result: ScheduleForm) => {
      expect(window.confirm).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalled();
      expect(result.toJSON()).toEqual(testScheduleForm.toJSON());
    });
    component.submit();
  });
});
