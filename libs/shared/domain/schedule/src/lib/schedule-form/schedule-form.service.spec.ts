import { TestBed } from '@angular/core/testing';

import { ScheduleFormService } from './schedule-form.service';

describe('ScheduleFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScheduleFormService = TestBed.get(ScheduleFormService);
    expect(service).toBeTruthy();
  });
});
