import { TestBed } from '@angular/core/testing';

import { ScheduleFactoryService } from './schedule-factory.service';

describe('ScheduleFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScheduleFactoryService = TestBed.get(ScheduleFactoryService);
    expect(service).toBeTruthy();
  });
});
