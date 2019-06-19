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
    component.ngOnInit();
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

  it('can add contact from current login', () => {
    // Initially current user is undefined
    expect(component.currentUser).toBeUndefined();
    // Become defined after login
    const authService = TestBed.get(AuthenticateService);
    authService.login();
    expect(component.currentUser).toBe(loginUser);
    component.addContactFromCurrentUser();
    const contacts = component.formGroup.get('contacts').value;
    const newContact = last(contacts);
    expect(loginUser).toMatchObject(newContact);
  });
  

  // it('should submit correct data from user input', () => {

  // });
});
