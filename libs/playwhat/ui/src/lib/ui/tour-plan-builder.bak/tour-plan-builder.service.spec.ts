import { TestBed } from '@angular/core/testing';

import { TourPlanBuilderService } from './tour-plan-builder.service';

describe('TourPlanBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TourPlanBuilderService = TestBed.get(TourPlanBuilderService);
    expect(service).toBeTruthy();
  });
});
