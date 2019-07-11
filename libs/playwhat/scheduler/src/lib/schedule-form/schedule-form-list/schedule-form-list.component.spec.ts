import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from "ng-mocks";
import { ScheduleFormListComponent } from './schedule-form-list.component';
import { Injectable } from '@angular/core';
import { ScheduleFormService } from '../schedule-form.service';
import { ScheduleForm } from '../schedule-form';
import { of, Observable } from 'rxjs';
import { User, AuthenticateService } from '@ygg/shared/user';
import { Query } from '@ygg/shared/infra/data-access';
import { ScheduleFormThumbnailComponent } from '../schedule-form-thumbnail/schedule-form-thumbnail.component';
import { PageTitleComponent } from '@ygg/shared/ui/widgets';

describe('ScheduleFormListComponent', () => {
  let component: ScheduleFormListComponent;
  let fixture: ComponentFixture<ScheduleFormListComponent>;
  let testScheduleForms: ScheduleForm[];
  let testUser: User;

  @Injectable()
  class MockScheduleFormService {
    find$() {}
  }

  @Injectable()
  class MockAuthenticateService {
    currentUser$: Observable<User>;
  }

  beforeAll(() => {
    testUser = User.forge();
    testScheduleForms = [];
    while (testScheduleForms.length < 7) {
      testScheduleForms.push(ScheduleForm.forge());
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleFormListComponent, MockComponent(ScheduleFormThumbnailComponent), MockComponent(PageTitleComponent)],
      providers: [
        { provide: ScheduleFormService, useClass: MockScheduleFormService },
        { provide: AuthenticateService, useClass: MockAuthenticateService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleFormListComponent);
  });

  it('By default, no @Input() scheduleForms, shows my(current user) schedule forms', done => {
    const mockScheduleFormService: MockScheduleFormService = TestBed.get(ScheduleFormService);
    const mockAuthenticateService: MockAuthenticateService = TestBed.get(AuthenticateService);
    mockAuthenticateService.currentUser$ = of(testUser);
    jest.spyOn(mockScheduleFormService, 'find$').mockImplementation(() => of(testScheduleForms));
    component = fixture.componentInstance;
    fixture.whenStable().then(() => {
      const query = new Query('creatorId', '==', testUser.id);
      expect(mockScheduleFormService.find$).toHaveBeenCalledWith(query);
      expect(component.ids).toEqual(testScheduleForms.map(form => form.id));
      done();
    });
    fixture.detectChanges();
  });
});
