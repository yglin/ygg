import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ScheduleFormService } from './schedule-form.service';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { of } from 'rxjs';
import { ScheduleForm } from './schedule-form';

describe('ScheduleFormService', () => {
  const testScheduleForm = ScheduleForm.forge();
  let service: ScheduleFormService;
  const mockDataAccessService = {
    get$: () => of(testScheduleForm),
    upsert: () => Promise.resolve(testScheduleForm)
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        ScheduleFormService,
        { provide: DataAccessService, useValue: mockDataAccessService }
      ]
    });
  });

  it('should get$ and upsert', () => {
    service = TestBed.get(ScheduleFormService);
    expect(service).toBeTruthy();
    service.get$('fake-id-does-not-matter').subscribe(form => {
      expect(form).toBe(testScheduleForm);
    });
    service.upsert(testScheduleForm).then(form => {
      expect(form).toBe(testScheduleForm);
    });
  });
});
