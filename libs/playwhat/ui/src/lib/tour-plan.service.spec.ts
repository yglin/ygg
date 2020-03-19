import { TestBed } from '@angular/core/testing';

import { TourPlanService } from './tour-plan.service';

describe('TourPlanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TourPlanService = TestBed.get(TourPlanService);
    expect(service).toBeTruthy();
  });
});
