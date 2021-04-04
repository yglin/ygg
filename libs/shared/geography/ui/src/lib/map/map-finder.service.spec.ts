import { TestBed } from '@angular/core/testing';

import { MapFinderService } from './map-finder.service';

describe('MapFinderService', () => {
  let service: MapFinderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapFinderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
