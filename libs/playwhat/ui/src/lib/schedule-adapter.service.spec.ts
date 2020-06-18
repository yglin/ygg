import { TestBed } from '@angular/core/testing';

import { ScheduleAdapterService } from './schedule-adapter.service';

describe('ScheduleAdapterService', () => {
  let service: ScheduleAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
