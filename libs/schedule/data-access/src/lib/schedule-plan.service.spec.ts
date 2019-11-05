import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SchedulePlanService } from '@ygg/schedule/data-access';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { of } from 'rxjs';
import { SchedulePlan } from '@ygg/schedule/core';
import { Injectable } from '@angular/core';

describe('SchedulePlanService', () => {
  const testSchedulePlan = SchedulePlan.forge();
  let service: SchedulePlanService;

  @Injectable()
  class MockDataAccessService {
    form: SchedulePlan;
    get$(id: string) {
      return of(testSchedulePlan);
    }
    upsert(collection: string, form: SchedulePlan) {
      this.form = form;
      return Promise.resolve();
    }
  }
  let mockDataAccessService: MockDataAccessService;

  // @Injectable()
  // class MockPlayTagService {
  //   upsertList(tags: PlayTag[]) {}
  // }
  // let mockPlayTagService: MockPlayTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        SchedulePlanService,
        { provide: DataAccessService, useClass: MockDataAccessService },
        // { provide: PlayTagService, useClass: MockPlayTagService }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(SchedulePlanService);
    mockDataAccessService = TestBed.get(DataAccessService);
    // mockPlayTagService = TestBed.get(PlayTagService);
  });

  it('should get$', done => {
    jest.spyOn(mockDataAccessService, 'get$');
    service.get$('fake-id-does-not-matter').subscribe(form => {
      expect(mockDataAccessService.get$).toHaveBeenCalled();
      expect(form).toBe(testSchedulePlan);
      done();
    });
  });

  it('should upsert', async done => {
    jest.spyOn(mockDataAccessService, 'upsert');
    await service.upsert(testSchedulePlan);
    expect(mockDataAccessService.upsert).toHaveBeenCalled();
    expect(mockDataAccessService.form).toBe(testSchedulePlan);
    done();
  });
});
