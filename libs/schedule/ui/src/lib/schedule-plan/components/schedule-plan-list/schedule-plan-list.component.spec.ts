import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from "ng-mocks";
import { SchedulePlanListComponent } from './schedule-plan-list.component';
import { Injectable } from '@angular/core';
import { SchedulePlanService } from '@ygg/schedule/data-access';
import { SchedulePlan } from '@ygg/schedule/core';
import { of, Observable } from 'rxjs';
import { User, AuthenticateService } from '@ygg/shared/user';
import { Query } from '@ygg/shared/infra/data-access';
import { SchedulePlanThumbnailComponent } from '../schedule-plan-thumbnail/schedule-plan-thumbnail.component';
import { PageTitleComponent } from '@ygg/shared/ui/widgets';

describe('SchedulePlanListComponent', () => {
  let component: SchedulePlanListComponent;
  let fixture: ComponentFixture<SchedulePlanListComponent>;
  let testSchedulePlans: SchedulePlan[];
  let testUser: User;

  @Injectable()
  class MockSchedulePlanService {
    find$() {}
  }

  @Injectable()
  class MockAuthenticateService {
    currentUser$: Observable<User>;
  }

  beforeAll(() => {
    testUser = User.forge();
    testSchedulePlans = [];
    while (testSchedulePlans.length < 7) {
      testSchedulePlans.push(SchedulePlan.forge());
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SchedulePlanListComponent, MockComponent(SchedulePlanThumbnailComponent), MockComponent(PageTitleComponent)],
      providers: [
        { provide: SchedulePlanService, useClass: MockSchedulePlanService },
        { provide: AuthenticateService, useClass: MockAuthenticateService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulePlanListComponent);
  });

  it('By default, no @Input() schedulePlans, shows my(current user) schedule forms', done => {
    const mockSchedulePlanService: MockSchedulePlanService = TestBed.get(SchedulePlanService);
    const mockAuthenticateService: MockAuthenticateService = TestBed.get(AuthenticateService);
    mockAuthenticateService.currentUser$ = of(testUser);
    jest.spyOn(mockSchedulePlanService, 'find$').mockImplementation(() => of(testSchedulePlans));
    component = fixture.componentInstance;
    fixture.whenStable().then(() => {
      const query = new Query('creatorId', '==', testUser.id);
      expect(mockSchedulePlanService.find$).toHaveBeenCalledWith(query);
      expect(component.ids).toEqual(testSchedulePlans.map(form => form.id));
      done();
    });
    fixture.detectChanges();
  });
});
