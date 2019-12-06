import { TestBed } from '@angular/core/testing';

import { AccommodationResolverService } from './accommodation-resolver.service';

describe('AccommodationResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccommodationResolverService = TestBed.get(AccommodationResolverService);
    expect(service).toBeTruthy();
  });
});
