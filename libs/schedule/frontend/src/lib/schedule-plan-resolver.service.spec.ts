import { TestBed } from '@angular/core/testing';

import { SchedulePlanResolverService } from './schedule-plan-resolver.service';

describe('SchedulePlanResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SchedulePlanResolverService = TestBed.get(SchedulePlanResolverService);
    expect(service).toBeTruthy();
  });
});
