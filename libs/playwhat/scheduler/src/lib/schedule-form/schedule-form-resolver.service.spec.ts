import { TestBed } from '@angular/core/testing';

import { ScheduleFormResolverService } from './schedule-form-resolver.service';

describe('ScheduleFormResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScheduleFormResolverService = TestBed.get(ScheduleFormResolverService);
    expect(service).toBeTruthy();
  });
});
