import { pick } from "lodash";
import 'hammerjs';
import { NO_ERRORS_SCHEMA, DebugElement, forwardRef, Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { MockComponent } from "ng-mocks";
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SharedTypesModule, DateRange, Contact } from '@ygg/shared/types';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';

import { ScheduleFormComponent } from './schedule-form.component';
import { ScheduleFormService } from './schedule-form.service';
import { ScheduleForm } from './schedule-form';
import { of, Observable, Subject, BehaviorSubject } from 'rxjs';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { ScheduleFormViewComponent } from './schedule-form-view/schedule-form-view.component';
import { User, AuthenticateService, AuthenticateUiService, UserService } from '@ygg/shared/user';
import { SchedulerAdminService } from '../admin/scheduler-admin.service';
import { By } from '@angular/platform-browser';
// import { PlaywhatPlayModule } from '@ygg/playwhat/play';

let testScheduleForm: ScheduleForm;
let loginUser: User;
let forgedUsers: User[];

@Injectable()
class MockAuthenticateService {
  currentUser$ = new BehaviorSubject<User>(null);
  login() {
    this.currentUser$.next(loginUser);
  }

  logout() {
    this.currentUser$.next(null);
  }
}

@Injectable()
class MockAuthenticateUiService {
  openLoginDialog() {}
}

@Injectable()
class MockSchedulerAdminService {
  getData$() {
    return of(forgedUsers.map(user => user.id));
  }
}

@Injectable()
class MockUserService {
  listByIds$() {
    return of(forgedUsers);
  }
}

@Injectable()
class MockScheduleFormService {
  get$() {
    return of(testScheduleForm);
  }
  upsert() {
    return Promise.resolve(testScheduleForm);
  }
}

@Component({
  selector: 'ygg-play-tags-input',
  template: '',
  styles: [''],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockPlayTagsInputComponent),
      multi: true
    }
  ]
})
export class MockPlayTagsInputComponent implements ControlValueAccessor {
  writeValue() {}
  registerOnChange() {}
  registerOnTouched() {}
  upsertTags() {}
}

describe('ScheduleFormComponent', () => {
  let component: ScheduleFormComponent;
  let fixture: ComponentFixture<ScheduleFormComponent>;
  let debugElement: DebugElement;

  beforeAll(() => {
    testScheduleForm = ScheduleForm.forge();
    loginUser = User.forge();
    forgedUsers = [];
    while(forgedUsers.length < 10) {
      forgedUsers.push(User.forge());
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleFormComponent, MockComponent(ScheduleFormViewComponent), MockPlayTagsInputComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedUiNgMaterialModule,
        SharedUiWidgetsModule,
        SharedTypesModule
      ],
      providers: [
        { provide: ScheduleFormService, useClass: MockScheduleFormService },
        { provide: SchedulerAdminService, useClass: MockSchedulerAdminService },
        { provide: AuthenticateService, useClass: MockAuthenticateService },
        { provide: AuthenticateUiService, useClass: MockAuthenticateUiService },
        { provide: UserService, useClass: MockUserService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleFormComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  // Mock window interaction dialogs.
  beforeEach(function() {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
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

  it('control "accommodationHelp" is initially disabled, a checkbox can enable it', () => {
    const controlAccommodationHelp = debugElement.query(By.css('#needAccommodationHelp [name=accommodationHelp]')).nativeElement;
    const checkboxAccommodationHelp = debugElement.query(By.css('#needAccommodationHelp [type="checkbox"]')).nativeElement;
    expect(controlAccommodationHelp.disabled).toBeTruthy();
    checkboxAccommodationHelp.click();
    expect(controlAccommodationHelp.disabled).toBeFalsy();
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
  
  it('should submit correct data from user input', done => {
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
      'tags',
      'likesDescription',
      'agentId'
    ];

    for (const controlName of formControlNames) {
      try {
        const control = formGroup.get(controlName);
        // Enable in-case it's disabled
        control.enable();
        control.setValue(testScheduleForm[controlName]);
      } catch (error) {
        error.message = (error.message || '') + `, controlName = ${controlName}`;
        throw error;
      }
    }
    component.setContacts(testScheduleForm.contacts);
    
    component.submit.subscribe((result: ScheduleForm) => {
      // Only check data consistence of properties in formControlNames
      expect(pick(result.toJSON(), formControlNames)).toEqual(pick(testScheduleForm.toJSON(), formControlNames));
      done();
    });
    component.onSubmit();
  });

  it('when submit, should also call PlayTagsInput.upsertTags() to upsert tags', async done => {
    const mockPlayTagsInputComponent = debugElement.query(By.directive(MockPlayTagsInputComponent)).componentInstance;
    jest.spyOn(mockPlayTagsInputComponent, 'upsertTags').mockImplementation(() => Promise.resolve());
    await component.onSubmit();
    expect(mockPlayTagsInputComponent.upsertTags).toHaveBeenCalled();
    done();
  });

  it('If logged in, ScheudleForm.creatorId should be current user\'s', done => {
    const mockAuthenticateService: MockAuthenticateService = TestBed.get(AuthenticateService);
    mockAuthenticateService.login();
    component.submit.subscribe((result: ScheduleForm) => {
      expect(result.creatorId).toBe(loginUser.id);
      done();
    });
    component.onSubmit();
  });

  it('If not logged in, ScheudleForm.creatorId should be undefined', done => {
    const mockAuthenticateUiService: MockAuthenticateUiService = TestBed.get(AuthenticateUiService);
    const mockAuthenticateService: MockAuthenticateService = TestBed.get(AuthenticateService);
    mockAuthenticateService.logout();
    jest.spyOn(mockAuthenticateUiService, 'openLoginDialog').mockImplementation(() => {
      // Do nothing, user skip login;
      return Promise.resolve();
    });
    component.submit.subscribe((result: ScheduleForm) => {
      expect(result.creatorId).toBeUndefined();
      done();
    });
    component.onSubmit();
  });

  it('If not logged in, when submit, ask user to log in to get ScheduleForm.creatorId', done => {
    const mockAuthenticateUiService: MockAuthenticateUiService = TestBed.get(AuthenticateUiService);
    const mockAuthenticateService: MockAuthenticateService = TestBed.get(AuthenticateService);
    mockAuthenticateService.logout();

    jest.spyOn(mockAuthenticateUiService, 'openLoginDialog').mockImplementation(() => {
      // Just mock login;
      mockAuthenticateService.currentUser$.next(loginUser);
      return Promise.resolve(loginUser);
    });
    component.submit.subscribe((result: ScheduleForm) => {
      expect(window.confirm).toHaveBeenCalled();
      expect(mockAuthenticateUiService.openLoginDialog).toHaveBeenCalled();
      expect(result.creatorId).toBe(loginUser.id);
      done();
    });
    component.onSubmit();
  });
  
});
