import { TestBed } from '@angular/core/testing';

import { HeadQuarterService } from './head-quarter.service';

describe('HeadQuarterService', () => {
  let service: HeadQuarterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeadQuarterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
