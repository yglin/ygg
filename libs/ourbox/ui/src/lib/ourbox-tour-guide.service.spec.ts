import { TestBed } from '@angular/core/testing';

import { OurboxTourGuideService } from './ourbox-tour-guide.service';

describe('OurboxTourGuideService', () => {
  let service: OurboxTourGuideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OurboxTourGuideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
