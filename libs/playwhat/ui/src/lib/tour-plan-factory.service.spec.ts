import { TestBed } from '@angular/core/testing';

import { TourPlanFactoryService } from './tour-plan-factory.service';

describe('TourPlanFactoryService', () => {
  let service: TourPlanFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourPlanFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
