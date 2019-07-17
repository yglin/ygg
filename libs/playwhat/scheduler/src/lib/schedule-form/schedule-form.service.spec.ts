import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ScheduleFormService } from './schedule-form.service';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { of } from 'rxjs';
import { ScheduleForm } from './schedule-form';
import { Injectable } from '@angular/core';

describe('ScheduleFormService', () => {
  const testScheduleForm = ScheduleForm.forge();
  let service: ScheduleFormService;

  @Injectable()
  class MockDataAccessService {
    form: ScheduleForm;
    get$(id: string) {
      return of(testScheduleForm);
    }
    upsert(collection: string, form: ScheduleForm) {
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
        ScheduleFormService,
        { provide: DataAccessService, useClass: MockDataAccessService },
        // { provide: PlayTagService, useClass: MockPlayTagService }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(ScheduleFormService);
    mockDataAccessService = TestBed.get(DataAccessService);
    // mockPlayTagService = TestBed.get(PlayTagService);
  });

  it('should get$', done => {
    jest.spyOn(mockDataAccessService, 'get$');
    service.get$('fake-id-does-not-matter').subscribe(form => {
      expect(mockDataAccessService.get$).toHaveBeenCalled();
      expect(form).toBe(testScheduleForm);
      done();
    });
  });

  it('should upsert', async done => {
    jest.spyOn(mockDataAccessService, 'upsert');
    await service.upsert(testScheduleForm);
    expect(mockDataAccessService.upsert).toHaveBeenCalled();
    expect(mockDataAccessService.form).toBe(testScheduleForm);
    done();
  });
});
