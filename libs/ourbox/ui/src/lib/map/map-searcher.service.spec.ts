import { TestBed } from '@angular/core/testing';

import { MapSearcherService } from './map-searcher.service';

describe('MapSearcherService', () => {
  let service: MapSearcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapSearcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
