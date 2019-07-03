import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from "ng-mocks";
import { ScheduleFormThumbnailComponent } from './schedule-form-thumbnail.component';
import { ScheduleForm } from '../schedule-form';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ScheduleFormService } from '../schedule-form.service';
import { of } from 'rxjs';
import { DateRangeComponent } from '@ygg/shared/types';
import { MatIcon } from '@angular/material';

describe('ScheduleFormThumbnailComponent', () => {
  let component: ScheduleFormThumbnailComponent;
  let fixture: ComponentFixture<ScheduleFormThumbnailComponent>;
  let testScheduleForm: ScheduleForm;

  @Injectable()
  class MockScheduleFormService {
    get$() {}
  }
  let mockScheduleFormService: MockScheduleFormService;

  @Injectable()
  class MockRouter {
    navigate() {
      return of(testScheduleForm);
    }
  }

  @Injectable()
  class MockRoute {}

  beforeAll(() => {
    testScheduleForm = ScheduleForm.forge();
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleFormThumbnailComponent, MockComponent(DateRangeComponent), MockComponent(MatIcon)],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: ScheduleFormService, useClass: MockScheduleFormService },
        { provide: ActivatedRoute, useClass: MockRoute }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleFormThumbnailComponent);
    component = fixture.componentInstance;
    component.id = testScheduleForm.id;
    mockScheduleFormService = TestBed.get(ScheduleFormService);
    jest.spyOn(mockScheduleFormService, 'get$').mockImplementation(() => of(testScheduleForm));
    fixture.detectChanges(); // This line will call component.ngOnInit()
  });

  it('should fetch schedule-form by @Input() id', done => {
    fixture.whenStable().then(() => {
      expect(mockScheduleFormService.get$).toHaveBeenCalledWith(testScheduleForm.id);
      expect(component.scheduleForm).toBe(testScheduleForm);
      done();
    });
  });

  it('should be able to click-link to schedule-form-view page', () => {
    const mockRouter: MockRouter = TestBed.get(Router);
    const mockRoute: MockRoute = TestBed.get(ActivatedRoute);
    jest.spyOn(mockRouter, 'navigate');
    component.onClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith([testScheduleForm.id], {relativeTo: mockRoute});
  });
});
