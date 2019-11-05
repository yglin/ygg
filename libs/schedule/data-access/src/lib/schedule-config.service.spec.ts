import { TestBed } from '@angular/core/testing';

import { ScheduleConfigService } from './schedule-config.service';

describe('ScheduleConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScheduleConfigService = TestBed.get(ScheduleConfigService);
    expect(service).toBeTruthy();
  });
});
