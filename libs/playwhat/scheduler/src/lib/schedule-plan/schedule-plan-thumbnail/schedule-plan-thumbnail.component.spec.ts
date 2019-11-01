import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from "ng-mocks";
import { SchedulePlanThumbnailComponent } from './schedule-plan-thumbnail.component';
import { SchedulePlan } from '../schedule-plan';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SchedulePlanService } from '../schedule-plan.service';
import { of } from 'rxjs';
import { DateRangeComponent } from '@ygg/shared/types';
import { MatIcon } from '@angular/material/icon';

describe('SchedulePlanThumbnailComponent', () => {
  let component: SchedulePlanThumbnailComponent;
  let fixture: ComponentFixture<SchedulePlanThumbnailComponent>;
  let testSchedulePlan: SchedulePlan;

  @Injectable()
  class MockSchedulePlanService {
    get$() {}
  }
  let mockSchedulePlanService: MockSchedulePlanService;

  @Injectable()
  class MockRouter {
    navigate() {
      return of(testSchedulePlan);
    }
  }

  @Injectable()
  class MockRoute {}

  beforeAll(() => {
    testSchedulePlan = SchedulePlan.forge();
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SchedulePlanThumbnailComponent, MockComponent(DateRangeComponent), MockComponent(MatIcon)],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: SchedulePlanService, useClass: MockSchedulePlanService },
        { provide: ActivatedRoute, useClass: MockRoute }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulePlanThumbnailComponent);
    component = fixture.componentInstance;
    component.id = testSchedulePlan.id;
    mockSchedulePlanService = TestBed.get(SchedulePlanService);
    jest.spyOn(mockSchedulePlanService, 'get$').mockImplementation(() => of(testSchedulePlan));
    fixture.detectChanges(); // This line will call component.ngOnInit()
  });

  it('should fetch schedule-plan by @Input() id', done => {
    fixture.whenStable().then(() => {
      expect(mockSchedulePlanService.get$).toHaveBeenCalledWith(testSchedulePlan.id);
      expect(component.schedulePlan).toBe(testSchedulePlan);
      done();
    });
  });

  it('should be able to click-link to schedule-plan-view page', () => {
    const mockRouter: MockRouter = TestBed.get(Router);
    const mockRoute: MockRoute = TestBed.get(ActivatedRoute);
    jest.spyOn(mockRouter, 'navigate');
    component.onClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith([testSchedulePlan.id], {relativeTo: mockRoute});
  });
});
