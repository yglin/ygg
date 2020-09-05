import { TestBed } from '@angular/core/testing';

import { LocationRecordAccessService } from './location-record-access.service';

describe('LocationRecordAccessService', () => {
  let service: LocationRecordAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationRecordAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
