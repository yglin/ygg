import { TestBed } from '@angular/core/testing';

import { TheThingMapFinderService } from './the-thing-map-finder.service';

describe('TheThingMapFinderService', () => {
  let service: TheThingMapFinderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheThingMapFinderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
